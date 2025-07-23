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

    // Sort by score descending (higher score = better match)
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    if (options.limit && results.length > options.limit) {
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
    let db: Database.Database | null = null;

    try {
      await this.storage.ensureIndexDir();
      const dbPath = this.storage.getIndexPath(docsetName);

      // Check if database exists
      const fs = await import('fs/promises');
      try {
        await fs.access(dbPath);
      } catch {
        console.warn(
          `No search index found for ${docsetName}. Run "docu fetch ${docsetName}" first.`
        );
        return;
      }

      db = new Database(dbPath, { readonly: true });

      const searchQuery = `
        SELECT id, title, url, snippet(docs_fts, 3, '<mark>', '</mark>', '...', 32) as snippet,
               bm25(docs_fts) as score, docset
        FROM docs_fts
        WHERE docs_fts MATCH ?
        ORDER BY bm25(docs_fts)
        LIMIT ?
      `;

      const preparedQuery = this.prepareFTSQuery(query);

      const searchResults = db
        .prepare(searchQuery)
        .all(preparedQuery, options.limit || 50);

      for (const row of searchResults as any[]) {
        // BM25 returns negative scores, convert to positive (lower is better, so we negate)
        const score = Math.abs(row.score);

        if (!options.minScore || score >= options.minScore) {
          const cleanSnippet = this.cleanSnippet(row.snippet);
          results.push({
            id: row.id,
            title: row.title,
            url: row.url,
            snippet: cleanSnippet,
            score: score,
            docset: row.docset,
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to search in ${docsetName}:`, error);
    } finally {
      if (db) {
        db.close();
      }
    }
  }

  private prepareFTSQuery(query: string): string {
    // Simple FTS5 query preparation
    // Split query into terms and join with AND for better matching
    const terms = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0)
      .map((term) => term.replace(/"/g, '""')) // Escape quotes
      .join(' AND ');

    return terms || query.trim();
  }

  private cleanSnippet(snippet: string): string {
    return snippet
      .replace(/<\/?mark>/g, '**') // Convert HTML marks to markdown
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\.\.\.\s*/g, '... ') // Clean up ellipses
      .replace(/\*\*\s+/g, '**') // Remove spaces after opening marks
      .replace(/\s+\*\*/g, '**') // Remove spaces before closing marks
      .trim();
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
