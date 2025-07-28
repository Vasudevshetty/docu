# 🔖 Bookmark Commands API Reference

Complete reference for all bookmark-related commands in docu-cli.

## Overview

The bookmark command suite provides comprehensive personal knowledge management capabilities. All bookmark commands are accessed through the `docu bookmark` or `docu bm` command group.

## Command Structure

```
docu bookmark <subcommand> [arguments] [options]
docu bm <subcommand> [arguments] [options]  # Short alias
```

---

## 📝 `docu bookmark add`

Add a bookmark from search results with optional metadata.

### Syntax

```bash
docu bookmark add <query> [options]
docu bm add <query> [options]
```

### Arguments

- `<query>` (required) - Search query to find and bookmark documentation

### Options

| Option          | Short | Type    | Default  | Description                                       |
| --------------- | ----- | ------- | -------- | ------------------------------------------------- |
| `--docset`      | `-d`  | string  | -        | Limit search to specific docset                   |
| `--notes`       | `-n`  | string  | -        | Add personal notes to the bookmark                |
| `--tags`        | `-t`  | string  | -        | Comma-separated tags for organization             |
| `--importance`  | `-i`  | string  | `medium` | Importance level: `low`, `medium`, `high`         |
| `--interactive` | -     | boolean | `false`  | Interactively select from multiple search results |

### Examples

#### Basic Usage

```bash
# Add simple bookmark
docu bookmark add "useState hook"

# Add bookmark with notes
docu bookmark add "useEffect" --notes "Side effects and cleanup in React"
```

#### Advanced Usage

```bash
# Full metadata bookmark
docu bookmark add "async/await patterns" \
  --notes "Modern JavaScript asynchronous programming" \
  --tags "javascript,async,es2017,patterns" \
  --importance high \
  --docset javascript

# Interactive selection
docu bookmark add "react state management" --interactive
```

### Output

```
✅ Bookmark added successfully!
   ID: abc123-def456-789
   Title: useState Hook - React Documentation
   Docset: react
   Notes: Side effects and cleanup in React
```

### Exit Codes

- `0` - Success
- `1` - General error (no results found, invalid options)

---

## 📋 `docu bookmark list`

List and filter your bookmarks with various criteria.

### Syntax

```bash
docu bookmark list [options]
docu bm list [options]
docu bm ls [options]  # Short alias
```

### Options

| Option         | Short | Type    | Default | Description                |
| -------------- | ----- | ------- | ------- | -------------------------- |
| `--docset`     | `-d`  | string  | -       | Filter by specific docset  |
| `--tag`        | `-t`  | string  | -       | Filter by specific tag     |
| `--category`   | `-c`  | string  | -       | Filter by category         |
| `--importance` | `-i`  | string  | -       | Filter by importance level |
| `--limit`      | `-l`  | number  | `20`    | Maximum number of results  |
| `--recent`     | -     | boolean | `false` | Show recent bookmarks only |
| `--json`       | -     | boolean | `false` | Output as JSON format      |

### Examples

#### Basic Listing

```bash
# List all bookmarks
docu bookmark list

# List recent bookmarks
docu bookmark list --recent --limit 10
```

#### Filtered Listing

```bash
# Filter by docset and tag
docu bookmark list --docset react --tag hooks

# Filter by importance
docu bookmark list --importance high --limit 5

# Filter by category
docu bookmark list --category "Frontend Framework"
```

#### Output Formats

```bash
# Human-readable output (default)
docu bookmark list --limit 3

# JSON output for scripting
docu bookmark list --json > bookmarks.json
```

### Sample Output

```
📚 Your Bookmarks (15 total):

 1. ⭐ useState Hook [react]
     📁 Frontend Framework
     #react #hooks #state
     💭 Essential for React state management
     🔗 https://react.dev/reference/react/useState
     📅 Added: 07/28/2025

 2. 📌 Async/Await Patterns [javascript]
     📁 Programming Language
     #javascript #async #es2017
     💭 Modern asynchronous programming patterns
     🔗 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
     📅 Added: 07/27/2025
```

### JSON Output Format

```json
[
  {
    "id": "abc123-def456-789",
    "title": "useState Hook",
    "content": "useState is a Hook that lets you add React state...",
    "docset": "react",
    "url": "https://react.dev/reference/react/useState",
    "tags": ["react", "hooks", "state"],
    "notes": "Essential for React state management",
    "createdAt": "2025-07-28T10:30:00.000Z",
    "updatedAt": "2025-07-28T10:30:00.000Z",
    "category": "Frontend Framework",
    "importance": "high"
  }
]
```

---

## 🔍 `docu bookmark search`

Search through your bookmark collection with full-text search capabilities.

### Syntax

```bash
docu bookmark search <query> [options]
```

### Arguments

- `<query>` (required) - Search query to find bookmarks

### Options

| Option     | Short | Type    | Default | Description                         |
| ---------- | ----- | ------- | ------- | ----------------------------------- |
| `--docset` | `-d`  | string  | -       | Filter results by docset            |
| `--tags`   | `-t`  | string  | -       | Filter by tags (comma-separated)    |
| `--limit`  | `-l`  | number  | `10`    | Maximum number of results           |
| `--pager`  | -     | boolean | `false` | Display results in paginated viewer |

### Search Capabilities

The search function performs full-text search across:

- Bookmark titles
- Content/snippets
- Personal notes
- Tags
- Categories

### Examples

#### Basic Search

```bash
# Simple text search
docu bookmark search "state management"

# Search with filters
docu bookmark search "hooks" --docset react --tags "state,lifecycle"
```

#### Advanced Search

```bash
# Search across multiple tags
docu bookmark search "async" --tags "javascript,patterns"

# Paginated results for large result sets
docu bookmark search "react" --pager --limit 20
```

### Sample Output

```
🔍 Found 3 bookmarks for "state management":

1. ⭐ useState Hook
   [react] Frontend Framework
   #react #hooks #state
   💭 Essential for React state management
   🔗 https://react.dev/reference/react/useState
   📅 07/28/2025

2. 📌 Vuex State Management
   [vue] Frontend Framework
   #vue #state #vuex
   💭 Centralized state management for Vue.js
   🔗 https://vuex.vuejs.org/
   📅 07/27/2025

3. 📌 Redux State Management
   [react] Frontend Framework
   #react #redux #state
   💭 Predictable state container for JavaScript apps
   🔗 https://redux.js.org/
   📅 07/26/2025
```

---

## 🗑️ `docu bookmark remove`

Remove a bookmark by its unique ID.

### Syntax

```bash
docu bookmark remove <id>
docu bm remove <id>
docu bm rm <id>  # Short alias
```

### Arguments

- `<id>` (required) - Unique bookmark ID to remove

### Examples

```bash
# Remove specific bookmark
docu bookmark remove abc123-def456-789

# Using short alias
docu bm rm abc123-def456-789
```

### Output

```
✅ Bookmark removed successfully!
   Removed: useState Hook
```

### Notes

- Bookmark IDs can be found using `docu bookmark list` or `docu bookmark search`
- Removal is permanent and cannot be undone
- Invalid IDs will result in an error message

---

## 📊 `docu bookmark stats`

Display comprehensive statistics and analytics about your bookmark collection.

### Syntax

```bash
docu bookmark stats
docu bm stats
```

### No Arguments or Options

This command provides a complete overview of your bookmark usage patterns.

### Sample Output

```
📊 Bookmark Statistics:

📚 Total Bookmarks: 45
📁 Total Collections: 3

📋 Bookmarks by Docset:
   react: 15
   javascript: 12
   typescript: 8
   python: 6
   docker: 4

🏷️  Bookmarks by Category:
   Frontend Framework: 15
   Programming Language: 20
   DevOps & Infrastructure: 4
   Documentation: 6

🏷️  Most Used Tags:
   #react: 15
   #hooks: 8
   #async: 7
   #typescript: 8
   #patterns: 5

⏰ Recent Activity:
   React Error Boundaries (07/28/2025)
   TypeScript Generics (07/27/2025)
   Docker Compose (07/26/2025)
   Vue Composition API (07/25/2025)
   Python Async/Await (07/24/2025)
```

### Analytics Provided

- **Total counts**: Bookmarks and collections
- **Distribution by docset**: Which technologies you bookmark most
- **Category breakdown**: Types of documentation you focus on
- **Tag frequency**: Most commonly used tags
- **Recent activity**: Your latest bookmarking activity

---

## 🎯 Integration with Other Commands

### Search Integration

The bookmark system integrates with the main search command:

```bash
# Search with bookmark suggestion
docu search "react patterns" --bookmark

# Output includes bookmark hint:
# 💾 Bookmark results:
# Use `docu bookmark add "react patterns"` to bookmark the top result
```

### Quick Bookmark Workflow

```bash
# 1. Search for information
docu search "useEffect cleanup"

# 2. If useful, bookmark it
docu bookmark add "useEffect cleanup" --notes "Important for preventing memory leaks"

# 3. Later, find it quickly
docu bookmark search "cleanup"
```

---

## 🔧 Configuration and Storage

### Storage Location

Bookmarks are stored in: `~/.docu/index/bookmarks.db`

### Database Schema

The bookmark system uses SQLite with FTS5 for efficient search:

```sql
-- Main bookmarks table
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  docset TEXT NOT NULL,
  url TEXT,
  tags TEXT,  -- JSON array
  notes TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  category TEXT,
  importance TEXT DEFAULT 'medium',
  snippet TEXT,
  search_query TEXT
);

-- Full-text search index
CREATE VIRTUAL TABLE bookmarks_fts USING fts5(
  id, title, content, notes, tags, category, docset
);
```

---

## 🚨 Error Handling

### Common Errors and Solutions

#### No Results Found

```
❌ No results found for "nonexistent query"
```

**Solution**: Try different search terms or check available docsets with `docu list`.

#### Bookmark Not Found

```
❌ Bookmark with ID abc123 not found
```

**Solution**: Verify the bookmark ID using `docu bookmark list` or `docu bookmark search`.

#### Invalid Importance Level

```
❌ Invalid importance level. Use: low, medium, high
```

**Solution**: Use one of the accepted importance values.

#### Database Error

```
❌ Failed to add bookmark: Database connection error
```

**Solution**: Check file permissions for `~/.docu/` directory or try re-initializing with `docu setup`.

---

## 💡 Tips and Best Practices

### Effective Tagging

```bash
# Use hierarchical tags
--tags "react,hooks,state,advanced"

# Include context
--tags "javascript,async,promises,es2017"

# Add project context
--tags "react,myproject,authentication"
```

### Smart Note-Taking

```bash
# Include context and use cases
--notes "Use for memoizing expensive calculations. Depends on dependency array."

# Add personal insights
--notes "Caused performance issues in my last project - be careful with object dependencies"
```

### Organization Strategies

```bash
# Daily workflow: Review recent bookmarks
docu bookmark list --recent --limit 5

# Learning sessions: Tag by topic
docu bookmark add "query" --tags "learning,react,week1"

# Project work: Tag by project
docu bookmark add "query" --tags "project-alpha,authentication"
```

---

## 🔄 Future API Extensions

### Planned Enhancements

- `docu bookmark edit <id>` - Edit existing bookmark metadata
- `docu bookmark export [format]` - Export bookmarks to various formats
- `docu bookmark import <file>` - Import bookmarks from file
- `docu bookmark duplicate <id>` - Find and manage duplicate bookmarks

### Collection Commands (Future)

- `docu bookmark collection create <name>` - Create bookmark collection
- `docu bookmark collection add <id> <collection>` - Add bookmark to collection
- `docu bookmark collection list` - List all collections

---

**See Also:**

- [Bookmark System Overview](../features/bookmark-system.md)
- [Daily Workflow Examples](../examples/daily-workflow.md)
- [Testing Guide](../development/testing.md)
