import {
  Bookmark,
  BookmarkSearchOptions,
  BookmarkStats,
} from '../domain/Bookmark.js';
import { BookmarkIndexer } from '../infrastructure/indexer/BookmarkIndexer.js';
import { SearchResult } from '../domain/Search.js';

export class BookmarkService {
  private readonly indexer: BookmarkIndexer;

  constructor() {
    this.indexer = new BookmarkIndexer();
  }

  async addBookmark(data: {
    title: string;
    content: string;
    docset: string;
    url: string;
    tags?: string[];
    notes?: string;
    category?: string;
    importance?: 'low' | 'medium' | 'high';
    snippet?: string;
    searchQuery?: string;
  }): Promise<string> {
    const bookmark = {
      title: data.title,
      content: data.content,
      docset: data.docset,
      url: data.url,
      tags: data.tags || [],
      notes: data.notes || '',
      category: data.category,
      importance: data.importance || 'medium',
      snippet: data.snippet,
      searchQuery: data.searchQuery,
    };

    return await this.indexer.addBookmark(bookmark);
  }

  async addBookmarkFromSearchResult(
    result: SearchResult,
    notes?: string,
    tags?: string[],
    importance?: 'low' | 'medium' | 'high'
  ): Promise<string> {
    // Auto-categorize based on docset
    const category = this.categorizeByDocset(result.docset);

    return await this.addBookmark({
      title: result.title,
      content: result.snippet,
      docset: result.docset,
      url: result.url,
      tags: tags || this.suggestTags(result),
      notes: notes || '',
      category,
      importance: importance || 'medium',
      snippet: result.snippet,
    });
  }

  async updateBookmark(id: string, updates: Partial<Bookmark>): Promise<void> {
    return await this.indexer.updateBookmark(id, updates);
  }

  async deleteBookmark(id: string): Promise<void> {
    return await this.indexer.deleteBookmark(id);
  }

  async getBookmark(id: string): Promise<Bookmark | null> {
    return await this.indexer.getBookmark(id);
  }

  async searchBookmarks(
    options: BookmarkSearchOptions = {}
  ): Promise<Bookmark[]> {
    return await this.indexer.searchBookmarks(options);
  }

  async getBookmarkStats(): Promise<BookmarkStats> {
    return await this.indexer.getBookmarkStats();
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return await this.searchBookmarks({});
  }

  async getBookmarksByDocset(docset: string): Promise<Bookmark[]> {
    return await this.searchBookmarks({ docset });
  }

  async getBookmarksByTag(tag: string): Promise<Bookmark[]> {
    return await this.searchBookmarks({ tags: [tag] });
  }

  async getBookmarksByCategory(category: string): Promise<Bookmark[]> {
    return await this.searchBookmarks({ category });
  }

  async getRecentBookmarks(limit: number = 10): Promise<Bookmark[]> {
    return await this.searchBookmarks({ limit });
  }

  async addTagToBookmark(id: string, tag: string): Promise<void> {
    const bookmark = await this.getBookmark(id);
    if (!bookmark) {
      throw new Error(`Bookmark with ID ${id} not found`);
    }

    if (!bookmark.tags.includes(tag)) {
      bookmark.tags.push(tag);
      await this.updateBookmark(id, { tags: bookmark.tags });
    }
  }

  async removeTagFromBookmark(id: string, tag: string): Promise<void> {
    const bookmark = await this.getBookmark(id);
    if (!bookmark) {
      throw new Error(`Bookmark with ID ${id} not found`);
    }

    bookmark.tags = bookmark.tags.filter((t) => t !== tag);
    await this.updateBookmark(id, { tags: bookmark.tags });
  }

  async updateBookmarkNotes(id: string, notes: string): Promise<void> {
    await this.updateBookmark(id, { notes });
  }

  async updateBookmarkImportance(
    id: string,
    importance: 'low' | 'medium' | 'high'
  ): Promise<void> {
    await this.updateBookmark(id, { importance });
  }

  private categorizeByDocset(docset: string): string {
    const categoryMap: Record<string, string> = {
      react: 'Frontend Framework',
      vue: 'Frontend Framework',
      angular: 'Frontend Framework',
      nodejs: 'Backend Runtime',
      express: 'Backend Framework',
      typescript: 'Programming Language',
      javascript: 'Programming Language',
      python: 'Programming Language',
      docker: 'DevOps & Infrastructure',
      kubernetes: 'DevOps & Infrastructure',
      aws: 'Cloud Services',
      azure: 'Cloud Services',
      gcp: 'Cloud Services',
    };

    return categoryMap[docset.toLowerCase()] || 'Documentation';
  }

  private suggestTags(result: SearchResult): string[] {
    const tags: string[] = [];

    // Add docset as tag
    tags.push(result.docset);

    // Extract potential tags from title and content
    const text = `${result.title} ${result.snippet}`.toLowerCase();

    const commonTags = [
      'hook',
      'component',
      'api',
      'function',
      'method',
      'class',
      'tutorial',
      'example',
      'guide',
      'reference',
      'concept',
      'state',
      'props',
      'event',
      'async',
      'promise',
      'callback',
      'syntax',
      'pattern',
      'best-practice',
      'troubleshooting',
    ];

    commonTags.forEach((tag) => {
      if (text.includes(tag)) {
        tags.push(tag);
      }
    });

    // Limit to 5 suggested tags
    return tags.slice(0, 5);
  }

  close(): void {
    this.indexer.close();
  }
}
