import Database from 'better-sqlite3';
import { DocContent } from '../../domain/Docset';
import { SearchResult, SearchOptions } from '../../domain/Search';
import { FileSystemAdapter } from '../storage/FileSystemAdapter';

export class SQLiteIndexer {
  private db: Database.Database | null = null;
  private readonly storage: FileSystemAdapter;

  constructor() {
    this.storage = new FileSystemAdapter();
  }

  async initializeIndex(docsetName: string): Promise<void> {
    await this.storage.ensureIndexDir();
    const dbPath = this.storage.getIndexPath(docsetName);

    this.db = new Database(dbPath);

    // Create FTS table if it doesn't exist
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS docs_fts USING fts5(
        id,
        title,
        url,
        content,
        headings,
        docset
      );
    `);
  }

  async indexDocuments(docsetName: string, docs: DocContent[]): Promise<void> {
    if (!this.db) {
      await this.initializeIndex(docsetName);
    }

    const insert = this.db!.prepare(`
      INSERT OR REPLACE INTO docs_fts (id, title, url, content, headings, docset)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = this.db!.transaction((documents: DocContent[]) => {
      for (const doc of documents) {
        insert.run(
          doc.id,
          doc.title,
          doc.url,
          doc.content,
          doc.headings.join(' '),
          docsetName
        );
      }
    });

    transaction(docs);
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    if (options.docset) {
      // Search specific docset
      await this.searchInDocset(options.docset, query, options, results);
    } else {
      // Search all docsets
      const docsets = await this.storage.listDocsets();
      for (const docset of docsets) {
        await this.searchInDocset(docset, query, options, results);
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    if (options.limit) {
      results.splice(options.limit);
    }

    return results;
  }

  private async searchInDocset(
    docsetName: string,
    query: string,
    options: SearchOptions,
    results: SearchResult[]
  ): Promise<void> {
    try {
      await this.initializeIndex(docsetName);

      if (!this.db) return;

      const searchQuery = `
        SELECT id, title, url, snippet(docs_fts, 3, '<mark>', '</mark>', '...', 64) as snippet,
               rank as score, docset
        FROM docs_fts
        WHERE docs_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `;

      const searchResults = this.db
        .prepare(searchQuery)
        .all(this.prepareFTSQuery(query), options.limit || 50);

      for (const row of searchResults as any[]) {
        if (!options.minScore || row.score >= options.minScore) {
          results.push({
            id: row.id,
            title: row.title,
            url: row.url,
            snippet: row.snippet.replace(/<\/?mark>/g, '**'),
            score: Math.abs(row.score), // FTS5 returns negative scores
            docset: row.docset,
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to search in ${docsetName}:`, error);
    } finally {
      this.closeDatabase();
    }
  }

  private prepareFTSQuery(query: string): string {
    // Escape and prepare query for FTS5
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => `"${term.replace(/"/g, '""')}"`)
      .join(' OR ');

    return terms || '""';
  }

  async removeIndex(docsetName: string): Promise<void> {
    const dbPath = this.storage.getIndexPath(docsetName);

    try {
      const fs = await import('fs/promises');
      await fs.unlink(dbPath);
    } catch (error) {
      // File might not exist, which is fine
    }
  }

  private closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
