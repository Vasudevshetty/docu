# 📚 docu-cli – AI-Powered Offline Documentation CLI

> Blazing-fast, AI-enhanced CLI to fetch, cache,## 🤖 AI Integration

### Quick Setup

```bash
# Interactive setup (recommended)
docu setup
```

### Manual Setup

1. Get your free API key from [Groq Console](https://console.groq.com/)
2. Configure using setup command or manually create config:

````bash
# Using setup command
docu setup

# Or manually in ~/.docu/.env
echo "GROQ_API_KEY=your_api_key_here" > ~/.docu/.env
```veloper docs with smart explanations and paginated display - right from your terminal.

---

## 🚀 Features

### Core Features

- 📶 **Offline-first**: Access popular docs (React, Vue, Angular, Node, Python, Docker, etc.) without internet
- 🔍 **Smart Search**: Full-text fuzzy search with SQLite FTS5 and BM25 scoring
- ⚡ **Lightning Fast**: Instant indexed results with highlighted matches
- 📁 **Local Cache**: Persistent storage for each docset
- 🧱 **Clean Architecture**: Modular TypeScript codebase with clear separation

### AI-Enhanced Features ✨

- 🤖 **AI Explanations**: Get detailed explanations powered by Groq AI
- 📖 **Smart Insights**: AI-enhanced search results with contextual guidance
- 💡 **Quick Reference**: AI-generated syntax examples and best practices
- 🧠 **Intelligent Context**: Search results enhanced with AI understanding

### Personal Knowledge Management 📚

- 🔖 **Smart Bookmarking**: Save and organize your favorite documentation snippets
- 🏷️ **Tagging System**: Categorize bookmarks with custom tags and categories
- 📝 **Personal Notes**: Add your own notes and insights to bookmarked content
- 🔍 **Bookmark Search**: Full-text search through your personal knowledge base
- 📊 **Usage Analytics**: Track your learning patterns and frequently accessed content

### Display & UX

- 📄 **Paginated Viewer**: Git-like pager for comfortable reading
- 🎨 **Markdown Rendering**: Beautiful formatted output with syntax highlighting
- 🌈 **Rich CLI**: Colorized output with emojis and progress indicators
- � **Multiple Formats**: JSON, Markdown, Plain text, and Table outputs

---

## 🎯 Use Cases

- 💻 **Offline Development**: Code anywhere without internet dependency
- 🚀 **Productivity Boost**: Instant access to docs with AI explanations
- 📦 **DevOps Integration**: Embed in containers and development environments
- 🎓 **Learning Enhancement**: AI-powered explanations for complex concepts
- 🔍 **Knowledge Base**: Personal offline documentation archive with smart search
- 📚 **Learning Tracking**: Build and curate your personal development knowledge base

---

## 📦 Installation

### NPM Installation (Recommended)

```bash
# Install globally from npm
npm install -g @vasudevshetty/docu-cli

# Verify installation
docu --version

# Quick setup with AI features (optional)
docu setup
````

### From Source

```bash
# Clone the repository
git clone https://github.com/Vasudevshetty/docu.git
cd docu

# Install dependencies
npm install

# Build the project
npm run build

# Install globally
npm install -g .
```

### First Time Setup

```bash
# Setup API key for AI features (optional)
docu setup

# Fetch your first docset
docu fetch react

# Start searching
docu search "useState"
```

---

## ⚙️ Tech Stack

| Layer            | Tech Stack                             |
| ---------------- | -------------------------------------- |
| Language         | **TypeScript**                         |
| CLI Framework    | `commander`, `yargs`                   |
| TUI (Optional)   | `ink`, `blessed`                       |
| Web Scraping     | `axios`, `cheerio`, `playwright`       |
| Search Engine    | `SQLite + FTS5`, fallback: `Lunr.js`   |
| DB Driver        | `better-sqlite3` or `sqlite3`          |
| Packaging        | `pkg`, `esbuild`, `npx`                |
| Storage Location | `~/.docu/` (cross-platform local data) |

---

## � AI Integration

### Setting Up Groq AI

1. Get your free API key from [Groq Console](https://console.groq.com/)
2. Create a `.env` file in your project:

```bash
# Copy the example file
cp .env.example .env

# Add your API key
GROQ_API_KEY=your_api_key_here
```

### AI Features

- **Smart Explanations**: `docu explain useState --simple`
- **Enhanced Search**: `docu search "react hooks" --ai`
- **Quick Reference**: `docu quick "useEffect" --ai`
- **Paginated Display**: `docu search "typescript" --pager`

---

## 📖 Usage Examples

### Basic Search

```bash
# Simple search
docu search "useState hook"

# Search with AI insights
docu search "react lifecycle" --ai

# Paginated results (like git log)
docu search "typescript generics" --pager
```

### AI Explanations

```bash
# Get detailed explanation
docu explain "useEffect"

# Simple explanation for beginners
docu explain "async await" --simple

# With code examples
docu explain "useState" --examples --pager
```

### Quick Reference

```bash
# Quick syntax lookup
docu quick "array methods"

# AI-powered quick reference
docu quick "promises" --ai
```

### Personal Bookmarks 🔖

```bash
# Add a bookmark from search results
docu bookmark add "useState hook" --notes "Essential for React state management"

# Add bookmark with tags and importance
docu bookmark add "async await" --tags "javascript,async,es2017" --importance high

# Interactive bookmark selection
docu bookmark add "react patterns" --interactive

# List all bookmarks
docu bookmark list

# Search through bookmarks
docu bookmark search "state management"

# Filter bookmarks by docset or tags
docu bookmark list --docset react --tag hooks

# View bookmark statistics
docu bookmark stats

# Remove a bookmark
docu bookmark remove <bookmark-id>
```

---

## �🧠 Implementation Plan

### 🏗️ 1. Project Setup

- Scaffold project using TypeScript
- Setup `tsconfig`, linting, prettier, ESModules
- Setup folder structure based on clean architecture

### 🧪 2. CLI Interface ✅

Core commands implemented:

- `docu fetch <docset>` - Download and cache documentation
- `docu search <query>` - Search with AI insights and pagination
- `docu list` - Show installed docsets
- `docu remove <docset>` - Delete cached documentation
- `docu explain <query>` - AI-powered explanations
- `docu quick <query>` - Quick reference with AI
- `docu copy <query>` - Copy code examples
- `docu update` - Update cached content
- `docu interactive` - Interactive search mode
- `docu available` - Browse available docsets

### 📥 3. Fetch & Normalize Docs ✅

- Enhanced Cheerio scraper with markdown extraction
- Clean content filtering and structure preservation
- Metadata storage with version tracking
- 10 popular docsets: React, Vue, Angular, Node.js, Express, TypeScript, Docker, Python, Django, FastAPI

### 📊 4. Indexing Engine ✅

- SQLite FTS5 full-text search with BM25 scoring
- Optimized tokenization and ranking
- Persistent storage in `~/.docu/index/<docset>.db`

### 🔎 5. Enhanced Search ✅

- Multi-format output (table, JSON, markdown, plain)
- AI-enhanced results with Groq integration
- Paginated display with navigation controls
- Syntax highlighting and emoji indicators

### 🤖 6. AI Integration ✅

- Groq LLM integration for smart explanations
- Context-aware responses using search results
- Fallback mechanisms for offline usage
- Environment-based configuration

### � 7. Advanced Features ✅

- Interactive TUI mode with real-time search
- Export functionality for search results
- Global npm installation support
- Cross-platform compatibility

---

## 🗂️ Folder Structure (Clean Architecture)

```bash
docu-cli/
├── bin/
│   └── index.ts                # CLI entry
├── src/
│   ├── core/                   # Use-cases (business logic)
│   │   ├── FetchDocs.ts
│   │   ├── SearchDocs.ts
│   │   └── IndexDocs.ts
│   ├── domain/                 # Entities & interfaces
│   │   └── Docset.ts
│   ├── infrastructure/         # Services (DB, scraping)
│   │   ├── scraper/
│   │   │   └── CheerioScraper.ts
│   │   ├── indexer/
│   │   │   └── SQLiteIndexer.ts
│   │   └── storage/
│   │       └── FileSystemAdapter.ts
│   ├── cli/                    # CLI handlers
│   │   ├── fetch.ts
│   │   ├── search.ts
│   │   ├── list.ts
│   │   └── remove.ts
│   └── config/
│       └── docsets.json        # Supported docset rules
├── .docu/                      # User cache directory
│   ├── react/
│   ├── nodejs/
│   └── index/
├── tsconfig.json
└── README.md
```

---

## 🧰 Example Commands

```bash
# Fetch a docset
docu fetch react

# Search offline docs
docu search useEffect

# Search with bookmark option
docu search "react hooks" --bookmark

# Add a bookmark
docu bookmark add "useState" --notes "React state hook"

# List bookmarks
docu bookmark list

# Search bookmarks
docu bookmark search "react"

# List available docsets
docu list

# Remove cached docset
docu remove nodejs
```

---

## 🌱 Future Enhancements

- 🔎 AI-powered summary: `docu explain useEffect`
- 💡 VS Code Extension: inline doc search
- 📄 Export results/snippets to PDF
- 🔖 Bookmarks and annotations
- 📤 Share docsets with team over LAN
- 🔄 Automatic background updates

---

## 🤖 Contribution Guidelines

- Maintain SOLID principles
- Follow clean architecture folder layout
- Add tests using `jest`
- Open issues before large changes

---

## 📦 Packaging & Distribution

- Build: `npm run build`
- Package: `pkg .`
- Install globally: `npm i -g .`
- Publish: `npm publish`

---

## 🧪 Sample Test Case (Jest)

```ts
test('should fetch and index React docs', async () => {
  const fetcher = new FetchDocs('react');
  const docs = await fetcher.run();
  expect(docs.length).toBeGreaterThan(100);

  const indexer = new SQLiteIndexer();
  await indexer.index('react', docs);
});
```

---

## 📌 Notes

- SQLite is preferred for long-term performance
- Modular scrapers support Markdown/HTML/JSON docs
- You can build your own docset with simple config

---
