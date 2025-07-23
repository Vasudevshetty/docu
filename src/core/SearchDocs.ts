import { SQLiteIndexer } from '../infrastructure/indexer/SQLiteIndexer';
import { SearchResult, SearchOptions } from '../domain/Search';

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
      minScore: 0.1,
      ...options,
    };

    const results = await this.indexer.search(query, searchOptions);

    if (results.length === 0) {
      console.log(`No results found for "${query}"`);
      console.log('Try:');
      console.log('- Using different keywords');
      console.log('- Checking if the docset is installed with "docu list"');
      console.log('- Fetching documentation with "docu fetch <docset>"');
    }

    return results;
  }
}
