import { FetchDocs } from '../src/core/FetchDocs';
import { SearchDocs } from '../src/core/SearchDocs';
import { ListDocs } from '../src/core/ListDocs';

describe('docu-cli Core Functionality', () => {
  test('should list available docsets', async () => {
    const lister = new ListDocs();
    const available = await lister.getAvailableDocsets();

    expect(available).toContain('react');
    expect(available).toContain('nodejs');
    expect(available).toContain('python');
  });

  test('should create search instance', () => {
    const searcher = new SearchDocs();
    expect(searcher).toBeDefined();
  });

  test('should handle empty search query', async () => {
    const searcher = new SearchDocs();

    await expect(searcher.search('')).rejects.toThrow(
      'Search query cannot be empty'
    );
  });

  test('should create fetch instance', () => {
    const fetcher = new FetchDocs();
    expect(fetcher).toBeDefined();
  });
});
