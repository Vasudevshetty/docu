# 🧪 Testing Configuration

This document covers the testing setup, configuration, and best practices for docu-cli development.

## 📋 Overview

docu-cli uses **Jest** as the primary testing framework with TypeScript support and ESM (ECMAScript Modules) configuration. The testing setup is designed to work seamlessly with the project's clean architecture and modern TypeScript features.

## 🛠️ Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
export default {
  // Use ts-jest preset for ESM support
  preset: 'ts-jest/presets/default-esm',

  // Treat .ts files as ESM modules
  extensionsToTreatAsEsm: ['.ts'],

  // Node.js environment for CLI testing
  testEnvironment: 'node',

  // Test file locations
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Test file patterns
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],

  // TypeScript transformation with ESM support
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'Node',
          target: 'ES2022',
          verbatimModuleSyntax: false, // Allows mixed import styles
        },
      },
    ],
  },

  // Module path mapping for .js imports
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Coverage configuration
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Key Configuration Points

#### ESM Support

- **`preset: 'ts-jest/presets/default-esm'`**: Enables ESM support in Jest
- **`extensionsToTreatAsEsm: ['.ts']`**: Treats TypeScript files as ESM modules
- **`useESM: true`**: Enables ESM in ts-jest transformer

#### Module Resolution

- **`moduleNameMapper`**: Maps `.js` imports to TypeScript files during testing
- **`verbatimModuleSyntax: false`**: Allows mixing of import styles in tests

#### Test Discovery

- **`roots`**: Looks for tests in both `src` and `tests` directories
- **`testMatch`**: Matches test files with `.test.ts` or `.spec.ts` extensions

## 📁 Test Structure

### Directory Layout

```
docu-cli/
├── tests/                      # Main test directory
│   ├── bookmark.test.ts        # Bookmark system tests
│   ├── core.test.ts           # Core functionality tests
│   └── integration/            # Integration tests
├── src/
│   └── **/__tests__/          # Unit tests near source code
└── coverage/                   # Test coverage reports
```

### Test Categories

#### Unit Tests (`tests/*.test.ts`)

- Test individual components in isolation
- Mock external dependencies
- Focus on business logic and edge cases

#### Integration Tests (`tests/integration/`)

- Test component interactions
- Use real database and file system
- Validate end-to-end workflows

#### CLI Tests

- Test command-line interface behavior
- Validate argument parsing and output
- Test error handling and user experience

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/bookmark.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="bookmark"

# Run tests for specific directory
npm test -- tests/integration/
```

### Advanced Test Options

```bash
# Verbose output with test descriptions
npm test -- --verbose

# Run tests in parallel (default)
npm test -- --maxWorkers=4

# Run tests serially (debugging)
npm test -- --runInBand

# Update snapshots
npm test -- --updateSnapshot

# Debug tests with Node.js debugger
npm test -- --inspect-brk
```

## 📝 Writing Tests

### Test File Structure

```typescript
// tests/example.test.ts
import { ExampleService } from '../src/services/ExampleService.js';
import type { ExampleInterface } from '../src/domain/Example.js';

describe('Example Service', () => {
  let service: ExampleService;

  beforeEach(() => {
    service = new ExampleService();
  });

  afterEach(() => {
    service.close();
  });

  describe('core functionality', () => {
    test('should perform basic operation', async () => {
      // Arrange
      const input = 'test input';

      // Act
      const result = await service.process(input);

      // Assert
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});
```

### Import Conventions

#### ✅ Correct Import Patterns

```typescript
// Regular imports with .js extension
import { BookmarkService } from '../src/services/BookmarkService.js';
import { BookmarkIndexer } from '../src/infrastructure/indexer/BookmarkIndexer.js';

// Type-only imports
import type { SearchResult } from '../src/domain/Search.js';
import type { Bookmark } from '../src/domain/Bookmark.js';
```

#### ❌ Incorrect Import Patterns

```typescript
// Missing .js extension (will cause module resolution errors)
import { BookmarkService } from '../src/services/BookmarkService';

// Mixed type and value imports with verbatimModuleSyntax
import { SearchResult, SearchDocs } from '../src/domain/Search';
```

### Test Patterns

#### Service Testing

```typescript
describe('BookmarkService', () => {
  let service: BookmarkService;

  beforeEach(() => {
    service = new BookmarkService();
  });

  afterEach(() => {
    service.close(); // Clean up resources
  });

  test('should add bookmark with metadata', async () => {
    const bookmarkData = {
      title: 'Test Bookmark',
      content: 'Test content',
      docset: 'test',
      url: 'https://example.com',
      tags: ['test', 'example'],
      notes: 'Test notes',
    };

    const id = await service.addBookmark(bookmarkData);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');

    const bookmark = await service.getBookmark(id);
    expect(bookmark?.title).toBe(bookmarkData.title);
  });
});
```

#### Database Testing

```typescript
describe('BookmarkIndexer', () => {
  let indexer: BookmarkIndexer;

  beforeEach(async () => {
    indexer = new BookmarkIndexer();
    await indexer.initializeBookmarkIndex();
  });

  afterEach(() => {
    indexer.close();
  });

  test('should search bookmarks with FTS', async () => {
    // Add test data
    await indexer.addBookmark({
      title: 'React Hooks',
      content: 'useState and useEffect patterns',
      docset: 'react',
      // ... other fields
    });

    const results = await indexer.searchBookmarks({
      query: 'hooks',
    });

    expect(results).toHaveLength(1);
    expect(results[0].title).toContain('React Hooks');
  });
});
```

#### CLI Testing

```typescript
import { execSync } from 'child_process';

describe('CLI Commands', () => {
  test('should show help for bookmark command', () => {
    const output = execSync('node dist/bin/index.js bookmark --help', {
      encoding: 'utf8',
    });

    expect(output).toContain('Manage your personal documentation bookmarks');
    expect(output).toContain('add');
    expect(output).toContain('list');
  });
});
```

## 🔧 Mocking and Test Utilities

### File System Mocking

```typescript
import { jest } from '@jest/globals';
import * as fs from 'fs/promises';

// Mock fs module
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

test('should handle file operations', async () => {
  mockFs.readFile.mockResolvedValue('test content');

  // Test your function that uses fs
  const result = await myFunction();

  expect(mockFs.readFile).toHaveBeenCalledWith('expected-path');
  expect(result).toBe('expected-result');
});
```

### Database Mocking

```typescript
import { jest } from '@jest/globals';

// Mock SQLite for unit tests
jest.mock('better-sqlite3', () => {
  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn(() => ({
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    })),
    exec: jest.fn(),
    close: jest.fn(),
  }));
});
```

### Service Mocking

```typescript
// Create mock service for testing
const mockBookmarkService = {
  addBookmark: jest.fn(),
  getBookmark: jest.fn(),
  searchBookmarks: jest.fn(),
  close: jest.fn(),
} as jest.Mocked<BookmarkService>;
```

## 📊 Coverage Configuration

### Coverage Targets

```javascript
// jest.config.js
export default {
  // ... other config

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/services/': {
      functions: 90,
      lines: 90,
    },
    './src/core/': {
      functions: 85,
      lines: 85,
    },
  },
};
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html

# Coverage summary in terminal
npm test -- --coverage --coverageReporters=text-summary
```

## 🐛 Debugging Tests

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_OPTIONS": "--experimental-vm-modules"
      }
    }
  ]
}
```

### Debug Commands

```bash
# Debug specific test file
node --inspect-brk node_modules/.bin/jest --runInBand tests/bookmark.test.ts

# Debug with VS Code
# 1. Set breakpoints in test or source code
# 2. Use "Debug Jest Tests" configuration
# 3. Run debugger on specific test file
```

## ⚡ Performance Testing

### Benchmark Tests

```typescript
describe('Performance Tests', () => {
  test('should search large bookmark collection efficiently', async () => {
    const service = new BookmarkService();

    // Add 1000 bookmarks
    const bookmarks = Array.from({ length: 1000 }, (_, i) => ({
      title: `Bookmark ${i}`,
      content: `Content for bookmark ${i}`,
      docset: 'test',
      url: `https://example.com/${i}`,
      tags: [`tag${i % 10}`],
    }));

    for (const bookmark of bookmarks) {
      await service.addBookmark(bookmark);
    }

    // Measure search performance
    const startTime = performance.now();
    const results = await service.searchBookmarks({ query: 'bookmark' });
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    expect(results.length).toBeGreaterThan(0);

    service.close();
  });
});
```

## 🔄 Continuous Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 21]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## ✅ Best Practices

### Test Organization

1. **Group related tests** with `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Clean up resources** in `afterEach` hooks
5. **Use type-safe mocks** with proper TypeScript types

### Performance

1. **Use `beforeEach/afterEach`** for setup/cleanup instead of `beforeAll/afterAll`
2. **Mock external dependencies** to avoid slow operations
3. **Use `runInBand`** for debugging, parallel execution for speed
4. **Keep tests focused** and avoid testing multiple concerns

### Maintainability

1. **Keep tests simple** and focused on single behaviors
2. **Use helper functions** for common test setup
3. **Update tests** when refactoring source code
4. **Document complex test scenarios** with comments

## 📚 Common Issues and Solutions

### Module Resolution Errors

```
Error: Cannot find module '../src/services/BookmarkService'
```

**Solution**: Add `.js` extension to import paths in test files.

### ESM Import Issues

```
Error: ESM syntax is not allowed in a CommonJS module
```

**Solution**: Ensure `verbatimModuleSyntax: false` in Jest configuration.

### Type Import Errors

```
Error: 'SearchResult' is a type and must be imported using a type-only import
```

**Solution**: Use `import type { SearchResult }` for type-only imports.

### Database Test Isolation

```
Error: Database is locked or tests interfere with each other
```

**Solution**: Use unique database paths or proper cleanup in `afterEach`.

---

**Next Steps:**

- Review [testing examples](../examples/testing-patterns.md)
- Check [CI/CD setup](./ci-cd.md)
- Learn about [debugging techniques](./debugging.md)
