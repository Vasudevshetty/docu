import { SQLiteIndexer } from '../infrastructure/indexer/SQLiteIndexer.js';
import { SearchResult, SearchOptions } from '../domain/Search.js';

export class SearchDocs {
  private readonly indexer: SQLiteIndexer;

  constructor() {
    this.indexer = new SQLiteIndexer();
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    // Set default options
    const searchOptions: SearchOptions = {
      limit: 10,
      minScore: 0.000001, // BM25 scores are typically very small
      ...options,
    };

    const results = await this.indexer.search(query, searchOptions);
    return results;
  }
}
