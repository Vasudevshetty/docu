import Database from 'better-sqlite3';
import {
  Bookmark,
  BookmarkCollection,
  BookmarkSearchOptions,
  BookmarkStats,
} from '../../domain/Bookmark.js';
import { FileSystemAdapter } from '../storage/FileSystemAdapter.js';
import { v4 as uuidv4 } from 'uuid';

export class BookmarkIndexer {
  private db: Database.Database | null = null;
  private readonly storage: FileSystemAdapter;

  constructor() {
    this.storage = new FileSystemAdapter();
  }

  async initializeBookmarkIndex(): Promise<void> {
    await this.storage.ensureIndexDir();
    const dbPath = this.storage.getBookmarkIndexPath();

    this.db = new Database(dbPath);

    // Create bookmarks table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        docset TEXT NOT NULL,
        url TEXT,
        tags TEXT, -- JSON array as string
        notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        category TEXT,
        importance TEXT DEFAULT 'medium',
        snippet TEXT,
        search_query TEXT
      );
    `);

    // Create collections table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bookmark_collections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        bookmarks TEXT, -- JSON array of bookmark IDs
        tags TEXT, -- JSON array as string
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        color TEXT
      );
    `);

    // Create FTS table for bookmark search
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS bookmarks_fts USING fts5(
        id,
        title,
        content,
        notes,
        tags,
        category,
        docset
      );
    `);

    // Create indexes for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_docset ON bookmarks(docset);
      CREATE INDEX IF NOT EXISTS idx_bookmarks_category ON bookmarks(category);
      CREATE INDEX IF NOT EXISTS idx_bookmarks_importance ON bookmarks(importance);
      CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at);
    `);
  }

  async addBookmark(
    bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!this.db) {
      await this.initializeBookmarkIndex();
    }

    const id = uuidv4();
    const now = Date.now();
    const fullBookmark: Bookmark = {
      ...bookmark,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    const insert = this.db!.prepare(`
      INSERT INTO bookmarks (
        id, title, content, docset, url, tags, notes, 
        created_at, updated_at, category, importance, snippet, search_query
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      fullBookmark.id,
      fullBookmark.title,
      fullBookmark.content,
      fullBookmark.docset,
      fullBookmark.url,
      JSON.stringify(fullBookmark.tags),
      fullBookmark.notes,
      now,
      now,
      fullBookmark.category,
      fullBookmark.importance,
      fullBookmark.snippet,
      fullBookmark.searchQuery
    );

    // Add to FTS index
    const insertFts = this.db!.prepare(`
      INSERT INTO bookmarks_fts (id, title, content, notes, tags, category, docset)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertFts.run(
      fullBookmark.id,
      fullBookmark.title,
      fullBookmark.content,
      fullBookmark.notes,
      fullBookmark.tags.join(' '),
      fullBookmark.category || '',
      fullBookmark.docset
    );

    return id;
  }

  async updateBookmark(id: string, updates: Partial<Bookmark>): Promise<void> {
    if (!this.db) {
      await this.initializeBookmarkIndex();
    }

    const bookmark = await this.getBookmark(id);
    if (!bookmark) {
      throw new Error(`Bookmark with ID ${id} not found`);
    }

    const updatedBookmark = { ...bookmark, ...updates, updatedAt: new Date() };
    const now = Date.now();

    const update = this.db!.prepare(`
      UPDATE bookmarks SET
        title = ?, content = ?, url = ?, tags = ?, notes = ?,
        updated_at = ?, category = ?, importance = ?, snippet = ?, search_query = ?
      WHERE id = ?
    `);

    update.run(
      updatedBookmark.title,
      updatedBookmark.content,
      updatedBookmark.url,
      JSON.stringify(updatedBookmark.tags),
      updatedBookmark.notes,
      now,
      updatedBookmark.category,
      updatedBookmark.importance,
      updatedBookmark.snippet,
      updatedBookmark.searchQuery,
      id
    );

    // Update FTS index
    const updateFts = this.db!.prepare(`
      UPDATE bookmarks_fts SET
        title = ?, content = ?, notes = ?, tags = ?, category = ?
      WHERE id = ?
    `);

    updateFts.run(
      updatedBookmark.title,
      updatedBookmark.content,
      updatedBookmark.notes,
      updatedBookmark.tags.join(' '),
      updatedBookmark.category || '',
      id
    );
  }

  async getBookmark(id: string): Promise<Bookmark | null> {
    if (!this.db) {
      await this.initializeBookmarkIndex();
    }

    const query = this.db!.prepare('SELECT * FROM bookmarks WHERE id = ?');
    const row = query.get(id) as any;

    if (!row) return null;

    return this.mapRowToBookmark(row);
  }

  async searchBookmarks(
    options: BookmarkSearchOptions = {}
  ): Promise<Bookmark[]> {
    if (!this.db) {
      await this.initializeBookmarkIndex();
    }

    let query = '';
    let params: any[] = [];

    if (options.query) {
      // Use FTS for text search
      query = `
        SELECT b.* FROM bookmarks b
        JOIN bookmarks_fts fts ON b.id = fts.id
        WHERE bookmarks_fts MATCH ?
      `;
      params.push(options.query);

      // Add additional filters
      if (options.docset) {
        query += ' AND b.docset = ?';
        params.push(options.docset);
      }
      if (options.category) {
        query += ' AND b.category = ?';
        params.push(options.category);
      }
      if (options.importance) {
        query += ' AND b.importance = ?';
        params.push(options.importance);
      }
    } else {
      // Regular search without FTS
      query = 'SELECT * FROM bookmarks WHERE 1=1';

      if (options.docset) {
        query += ' AND docset = ?';
        params.push(options.docset);
      }
      if (options.category) {
        query += ' AND category = ?';
        params.push(options.category);
      }
      if (options.importance) {
        query += ' AND importance = ?';
        params.push(options.importance);
      }
      if (options.tags && options.tags.length > 0) {
        // Search for bookmarks that contain any of the specified tags
        const tagConditions = options.tags
          .map(() => 'tags LIKE ?')
          .join(' OR ');
        query += ` AND (${tagConditions})`;
        options.tags.forEach((tag) => params.push(`%"${tag}"%`));
      }
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    const stmt = this.db!.prepare(query);
    const rows = stmt.all(...params) as any[];

    return rows.map((row) => this.mapRowToBookmark(row));
  }

  async deleteBookmark(id: string): Promise<void> {
    if (!this.db) {
      await this.initializeBookmarkIndex();
    }

    const deleteStmt = this.db!.prepare('DELETE FROM bookmarks WHERE id = ?');
    const deleteFtsStmt = this.db!.prepare(
      'DELETE FROM bookmarks_fts WHERE id = ?'
    );

    deleteStmt.run(id);
    deleteFtsStmt.run(id);
  }

  async getBookmarkStats(): Promise<BookmarkStats> {
    if (!this.db) {
      await this.initializeBookmarkIndex();
    }

    const totalBookmarks = this.db!.prepare(
      'SELECT COUNT(*) as count FROM bookmarks'
    ).get() as any;
    const totalCollections = this.db!.prepare(
      'SELECT COUNT(*) as count FROM bookmark_collections'
    ).get() as any;

    const byDocset = this.db!.prepare(
      `
      SELECT docset, COUNT(*) as count 
      FROM bookmarks 
      GROUP BY docset 
      ORDER BY count DESC
    `
    ).all() as any[];

    const byCategory = this.db!.prepare(
      `
      SELECT category, COUNT(*) as count 
      FROM bookmarks 
      WHERE category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC
    `
    ).all() as any[];

    const recentBookmarks = await this.searchBookmarks({ limit: 5 });

    // Calculate most used tags
    const allTags: string[] = [];
    const bookmarks = await this.searchBookmarks({});
    bookmarks.forEach((b) => allTags.push(...b.tags));

    const tagCounts = allTags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalBookmarks: totalBookmarks.count,
      totalCollections: totalCollections.count,
      bookmarksByDocset: byDocset.reduce((acc, row) => {
        acc[row.docset] = row.count;
        return acc;
      }, {}),
      bookmarksByCategory: byCategory.reduce((acc, row) => {
        acc[row.category] = row.count;
        return acc;
      }, {}),
      mostUsedTags,
      recentActivity: recentBookmarks,
    };
  }

  private mapRowToBookmark(row: any): Bookmark {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      docset: row.docset,
      url: row.url,
      tags: JSON.parse(row.tags || '[]'),
      notes: row.notes || '',
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      category: row.category,
      importance: row.importance,
      snippet: row.snippet,
      searchQuery: row.search_query,
    };
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
