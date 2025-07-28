# 🔖 Bookmark System

The Smart Bookmarking System transforms docu-cli into a comprehensive personal knowledge management platform, allowing you to save, organize, and quickly retrieve documentation snippets with personal notes and intelligent categorization.

## 🎯 Overview

The bookmark system addresses a common developer pain point: **repeatedly searching for the same documentation**. Instead of losing context and wasting time on duplicate searches, you can build a curated personal knowledge base that grows more valuable over time.

## ✨ Key Features

### 📚 Personal Knowledge Base

- Save frequently accessed documentation for instant retrieval
- Reduce repetitive searches for the same information
- Build a curated collection of important references over time

### 🧠 Intelligent Organization

- **Auto-categorization** based on docset (Frontend Framework, Backend Runtime, etc.)
- **Smart tag suggestions** based on content analysis
- **Importance levels** (low, medium, high) for prioritization
- **Custom categories** for project-specific organization

### 📝 Rich Metadata Support

- **Personal notes** for context and insights
- **Custom tags** for flexible organization
- **Search query tracking** to remember how content was found
- **Timestamps** for activity tracking

### 🔍 Powerful Search Capabilities

- **Full-text search** through bookmarks using SQLite FTS5
- **Filter by** docset, category, tags, or importance
- **Fuzzy matching** for flexible queries
- **Combined searches** across title, content, and notes

### 📊 Analytics & Insights

- Usage statistics and learning patterns
- Most frequently used tags
- Recent activity tracking
- Bookmarks distribution by docset and category

## 🚀 Getting Started

### Basic Bookmark Workflow

```bash
# 1. Search for information
docu search "react hooks"

# 2. Add bookmark from search results
docu bookmark add "useState" --notes "Essential for state management"

# 3. List your bookmarks
docu bookmark list

# 4. Search through bookmarks later
docu bookmark search "state"
```

### Advanced Organization

```bash
# Add bookmark with full metadata
docu bookmark add "useEffect" \
  --notes "Side effects and cleanup in React" \
  --tags "react,hooks,lifecycle" \
  --importance high \
  --interactive

# Filter bookmarks by criteria
docu bookmark list --docset react --tag hooks --limit 10
docu bookmark list --category "Frontend Framework" --importance high
docu bookmark list --recent --limit 5
```

## 📋 Command Reference

### Core Commands

#### `docu bookmark add <query> [options]`

Add a bookmark from search results.

**Options:**

- `-d, --docset <docset>` - Limit search to specific docset
- `-n, --notes <notes>` - Add personal notes to the bookmark
- `-t, --tags <tags>` - Comma-separated tags for the bookmark
- `-i, --importance <level>` - Importance level: low, medium, high
- `--interactive` - Interactively select from search results

**Examples:**

```bash
# Basic bookmark
docu bookmark add "useState"

# With metadata
docu bookmark add "async/await" \
  --notes "Modern JavaScript async patterns" \
  --tags "javascript,async,es2017" \
  --importance high

# Interactive selection
docu bookmark add "react patterns" --interactive
```

#### `docu bookmark list [options]`

List your bookmarks with optional filtering.

**Options:**

- `-d, --docset <docset>` - Filter by docset
- `-t, --tag <tag>` - Filter by tag
- `-c, --category <category>` - Filter by category
- `-i, --importance <level>` - Filter by importance level
- `-l, --limit <number>` - Maximum number of results (default: 20)
- `--recent` - Show recent bookmarks
- `--json` - Output as JSON

**Examples:**

```bash
# List all bookmarks
docu bookmark list

# Filter by criteria
docu bookmark list --docset react --tag hooks
docu bookmark list --importance high --limit 5
docu bookmark list --recent --limit 10

# JSON output for scripting
docu bookmark list --json > my-bookmarks.json
```

#### `docu bookmark search <query> [options]`

Search through your bookmarks.

**Options:**

- `-d, --docset <docset>` - Filter by docset
- `-t, --tags <tags>` - Filter by tags (comma-separated)
- `-l, --limit <number>` - Maximum number of results (default: 10)
- `--pager` - Display results in a paginated viewer

**Examples:**

```bash
# Basic search
docu bookmark search "state management"

# Advanced search with filters
docu bookmark search "hooks" --docset react --tags "state,lifecycle"

# Paginated results
docu bookmark search "async" --pager
```

#### `docu bookmark remove <id>`

Remove a bookmark by ID.

**Examples:**

```bash
# Remove specific bookmark
docu bookmark remove abc123-def456-789
```

#### `docu bookmark stats`

Show bookmark statistics and analytics.

**Example Output:**

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
```

## 🎨 Visual Indicators

The bookmark system uses visual indicators to help you quickly identify important information:

| Icon | Meaning                    |
| ---- | -------------------------- |
| ⭐   | High importance bookmark   |
| 📌   | Medium importance bookmark |
| 📋   | Low importance bookmark    |
| 📁   | Category indicator         |
| #️⃣   | Tags                       |
| 💭   | Personal notes             |
| 🔗   | Source URL                 |
| 📅   | Creation date              |

## 💡 Best Practices

### Effective Note-Taking

```bash
# Good: Specific, actionable notes
docu bookmark add "useCallback" \
  --notes "Use to memoize functions, prevents unnecessary re-renders"

# Better: Include context and use cases
docu bookmark add "useCallback" \
  --notes "Memoize functions in React. Use when passing callbacks to optimized child components. Combine with React.memo() for performance gains."
```

### Smart Tagging Strategy

```bash
# Use hierarchical tags
--tags "react,hooks,performance,optimization"

# Include skill level
--tags "react,advanced,patterns"

# Add project context
--tags "react,myproject,authentication"
```

### Importance Guidelines

- **High**: Core concepts you use daily, critical patterns, frequent references
- **Medium**: Important but not daily use, good-to-know concepts
- **Low**: Nice-to-have, experimental features, rare use cases

## 🔄 Workflow Integration

### Daily Development Workflow

```bash
# Morning: Check recent bookmarks for context
docu bookmark list --recent --limit 5

# During development: Search and bookmark solutions
docu search "react error boundaries" --bookmark
docu bookmark add "error boundaries" \
  --notes "Use for production error handling"

# End of day: Review and organize bookmarks
docu bookmark stats
docu bookmark list --tag "to-review"
```

### Learning Sessions

```bash
# Learning React hooks
docu bookmark add "useState" \
  --importance high \
  --notes "Basic state management"

docu bookmark add "useEffect" \
  --importance high \
  --notes "Side effects and cleanup"

docu bookmark add "useContext" \
  --importance medium \
  --notes "For avoiding prop drilling"

# Later review
docu bookmark search "react hooks"
docu bookmark list --tag react --category "Frontend Framework"
```

### Project-Based Organization

```bash
# Tag bookmarks by project
docu bookmark add "authentication patterns" \
  --tags "auth,security,project-alpha" \
  --notes "OAuth2 implementation for project alpha"

# Filter by project later
docu bookmark search "project-alpha"
```

## 🎯 Advanced Features

### Smart Integration with Search

The bookmark system integrates seamlessly with regular search:

```bash
# Search with bookmark option
docu search "react patterns" --bookmark

# Shows bookmark suggestion after results:
# 💾 Bookmark results:
# Use `docu bookmark add "react patterns"` to bookmark the top result
# Use `docu bookmark add "react patterns" --interactive` to choose from results
```

### Auto-Categorization

Bookmarks are automatically categorized based on their docset:

| Docset                         | Auto-Category             |
| ------------------------------ | ------------------------- |
| react, vue, angular            | Frontend Framework        |
| nodejs, express                | Backend Runtime/Framework |
| typescript, javascript, python | Programming Language      |
| docker, kubernetes             | DevOps & Infrastructure   |
| aws, azure, gcp                | Cloud Services            |

### Smart Tag Suggestions

The system analyzes content to suggest relevant tags:

- Extracts common patterns from title and content
- Suggests technology-specific tags
- Includes concept-based tags (hook, component, api, etc.)
- Limits suggestions to 5 most relevant tags

## 📊 Analytics & Insights

### Usage Patterns

The bookmark system tracks your learning and usage patterns:

- **Most bookmarked technologies**: Understand your focus areas
- **Tag frequency**: Identify your most referenced concepts
- **Temporal patterns**: See your learning progression over time
- **Category distribution**: Balance across different technology areas

### Learning Analytics

```bash
# View your learning patterns
docu bookmark stats

# Identify knowledge gaps
docu bookmark list --category "Programming Language" --limit 3
docu bookmark list --docset python --limit 3

# Track recent learning
docu bookmark list --recent --limit 10
```

## 🔧 Technical Details

### Storage & Performance

- **Database**: SQLite with FTS5 for fast full-text search
- **Location**: `~/.docu/index/bookmarks.db`
- **Indexing**: Automatic indexing for title, content, notes, and tags
- **Performance**: Sub-second search even with thousands of bookmarks

### Data Structure

```sql
-- Bookmarks table schema
CREATE TABLE bookmarks (
  id TEXT PRIMARY KEY,           -- UUID
  title TEXT NOT NULL,           -- Document title
  content TEXT,                  -- Document content/snippet
  docset TEXT NOT NULL,          -- Source docset
  url TEXT,                      -- Source URL
  tags TEXT,                     -- JSON array of tags
  notes TEXT,                    -- Personal notes
  created_at INTEGER NOT NULL,   -- Creation timestamp
  updated_at INTEGER NOT NULL,   -- Last update timestamp
  category TEXT,                 -- Auto-generated category
  importance TEXT DEFAULT 'medium', -- low/medium/high
  snippet TEXT,                  -- Search result snippet
  search_query TEXT              -- Original search query
);

-- Full-text search index
CREATE VIRTUAL TABLE bookmarks_fts USING fts5(
  id, title, content, notes, tags, category, docset
);
```

## 🚀 Future Enhancements

### Phase 2: Advanced Organization

- **Collections**: Group bookmarks into project-based collections
- **Smart recommendations**: Suggest related bookmarks
- **Duplicate detection**: Identify and merge similar bookmarks

### Phase 3: Collaboration

- **Export/Import**: Share bookmark collections with team members
- **Team bookmarks**: Shared knowledge bases for teams
- **Social features**: Popular bookmarks and recommendations

### Phase 4: AI Integration

- **Smart summaries**: AI-generated bookmark summaries
- **Auto-tagging**: Intelligent tag suggestions based on content
- **Learning paths**: AI-curated learning sequences from bookmarks

## 🤝 Contributing

The bookmark system is designed for extensibility. Key areas for contribution:

- **New categorization rules**: Add auto-categorization for new docsets
- **Enhanced analytics**: Additional metrics and insights
- **UI improvements**: Better visualization of bookmark data
- **Export formats**: Additional export options (PDF, HTML, etc.)

---

**Next Steps:**

- Try the [daily workflow examples](../examples/daily-workflow.md)
- Explore [advanced search patterns](../examples/search-patterns.md)
- Set up [team collaboration](../examples/team-collaboration.md)
