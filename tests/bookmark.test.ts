import { BookmarkService } from '../src/services/BookmarkService.js';
import { BookmarkIndexer } from '../src/infrastructure/indexer/BookmarkIndexer.js';
import type { SearchResult } from '../src/domain/Search.js';

describe('Bookmark System', () => {
  let bookmarkService: BookmarkService;

  beforeEach(() => {
    bookmarkService = new BookmarkService();
  });

  afterEach(() => {
    bookmarkService.close();
  });

  test('should create bookmark service', () => {
    expect(bookmarkService).toBeDefined();
  });

  test('should add a simple bookmark', async () => {
    const bookmarkData = {
      title: 'React useState Hook',
      content:
        'useState is a Hook that lets you add React state to function components.',
      docset: 'react',
      url: 'https://react.dev/reference/react/useState',
      tags: ['react', 'hook', 'state'],
      notes: 'Important for state management',
      importance: 'high' as const,
    };

    const bookmarkId = await bookmarkService.addBookmark(bookmarkData);
    expect(bookmarkId).toBeDefined();
    expect(typeof bookmarkId).toBe('string');
  });

  test('should retrieve bookmark by id', async () => {
    const bookmarkData = {
      title: 'Vue Composition API',
      content:
        'The Composition API is a set of APIs that allows us to author Vue components using imported functions.',
      docset: 'vue',
      url: 'https://vuejs.org/guide/extras/composition-api.html',
      tags: ['vue', 'composition-api'],
      notes: 'Modern Vue development approach',
    };

    const bookmarkId = await bookmarkService.addBookmark(bookmarkData);
    const retrievedBookmark = await bookmarkService.getBookmark(bookmarkId);

    expect(retrievedBookmark).toBeDefined();
    expect(retrievedBookmark?.title).toBe(bookmarkData.title);
    expect(retrievedBookmark?.docset).toBe(bookmarkData.docset);
    expect(retrievedBookmark?.tags).toEqual(bookmarkData.tags);
  });

  test('should search bookmarks by query', async () => {
    // Add a few bookmarks
    await bookmarkService.addBookmark({
      title: 'JavaScript Promises',
      content:
        'A Promise is an object representing the eventual completion or failure of an asynchronous operation.',
      docset: 'javascript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
      tags: ['javascript', 'async', 'promise'],
    });

    await bookmarkService.addBookmark({
      title: 'Python Asyncio',
      content:
        'asyncio is a library to write concurrent code using the async/await syntax.',
      docset: 'python',
      url: 'https://docs.python.org/3/library/asyncio.html',
      tags: ['python', 'async', 'asyncio'],
    });

    const results = await bookmarkService.searchBookmarks({ query: 'async' });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some(
        (b) => b.title.includes('Promise') || b.title.includes('Asyncio')
      )
    ).toBe(true);
  });

  test('should filter bookmarks by docset', async () => {
    await bookmarkService.addBookmark({
      title: 'React useEffect',
      content:
        'useEffect is a React Hook that lets you perform side effects in function components.',
      docset: 'react',
      url: 'https://react.dev/reference/react/useEffect',
      tags: ['react', 'hook', 'effect'],
    });

    await bookmarkService.addBookmark({
      title: 'Vue Watchers',
      content:
        'Watchers are a declarative way to perform side effects in response to data changes.',
      docset: 'vue',
      url: 'https://vuejs.org/guide/essentials/watchers.html',
      tags: ['vue', 'watcher'],
    });

    const reactBookmarks = await bookmarkService.getBookmarksByDocset('react');
    const vueBookmarks = await bookmarkService.getBookmarksByDocset('vue');

    expect(reactBookmarks.length).toBeGreaterThan(0);
    expect(vueBookmarks.length).toBeGreaterThan(0);
    expect(reactBookmarks.every((b) => b.docset === 'react')).toBe(true);
    expect(vueBookmarks.every((b) => b.docset === 'vue')).toBe(true);
  });

  test('should add bookmark from search result', async () => {
    const searchResult: SearchResult = {
      id: 'test-result-1',
      title: 'TypeScript Interfaces',
      url: 'https://www.typescriptlang.org/docs/handbook/interfaces.html',
      snippet:
        "One of TypeScript's core principles is that type checking focuses on the shape that values have.",
      score: 0.95,
      docset: 'typescript',
    };

    const bookmarkId = await bookmarkService.addBookmarkFromSearchResult(
      searchResult,
      'Great explanation of interfaces',
      ['typescript', 'interface', 'types'],
      'high'
    );

    const bookmark = await bookmarkService.getBookmark(bookmarkId);
    expect(bookmark).toBeDefined();
    expect(bookmark?.title).toBe(searchResult.title);
    expect(bookmark?.docset).toBe(searchResult.docset);
    expect(bookmark?.importance).toBe('high');
    expect(bookmark?.notes).toBe('Great explanation of interfaces');
  });

  test('should get bookmark statistics', async () => {
    // Add some test bookmarks
    await bookmarkService.addBookmark({
      title: 'Test Bookmark 1',
      content: 'Test content',
      docset: 'react',
      url: 'https://example.com/1',
      tags: ['test', 'react'],
    });

    await bookmarkService.addBookmark({
      title: 'Test Bookmark 2',
      content: 'Test content',
      docset: 'vue',
      url: 'https://example.com/2',
      tags: ['test', 'vue'],
    });

    const stats = await bookmarkService.getBookmarkStats();
    expect(stats.totalBookmarks).toBeGreaterThan(0);
    expect(Object.keys(stats.bookmarksByDocset)).toContain('react');
    expect(Object.keys(stats.bookmarksByDocset)).toContain('vue');
  });

  test('should update bookmark tags', async () => {
    const bookmarkId = await bookmarkService.addBookmark({
      title: 'Test Bookmark for Tags',
      content: 'Test content',
      docset: 'javascript',
      url: 'https://example.com/tags',
      tags: ['initial'],
    });

    await bookmarkService.addTagToBookmark(bookmarkId, 'new-tag');
    const bookmark = await bookmarkService.getBookmark(bookmarkId);

    expect(bookmark?.tags).toContain('initial');
    expect(bookmark?.tags).toContain('new-tag');
  });
});
