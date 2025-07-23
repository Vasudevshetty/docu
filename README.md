# 📚 docu-cli – Offline Documentation Search CLI

> Blazing-fast, offline-first CLI to fetch, cache, and search developer docs right from your terminal using a clean TypeScript architecture.

---

## 🚀 Features

- 📶 Offline access to popular docs (React, Node, Python, Docker, etc.)
- 🔍 Full-text fuzzy search (SQLite FTS5 or Lunr.js fallback)
- ⚡ Fast indexed results with highlighted matches
- 📁 Local cache for each docset
- 🧱 Class-based modular codebase in TypeScript
- 🌐 Easily add new frameworks or docsets
- 🖥️ Optional interactive TUI (Ink)

---

## 🎯 Use Cases

- 💻 Develop anywhere without internet
- 🚀 Speed up dev workflows with instant docs
- 📦 Embed CLI into local dev containers
- 🔍 Create a personal offline doc archive

---

## ⚙️ Tech Stack

| Layer              | Tech Stack                              |
|-------------------|------------------------------------------|
| Language           | **TypeScript**                          |
| CLI Framework      | `commander`, `yargs`                    |
| TUI (Optional)     | `ink`, `blessed`                        |
| Web Scraping       | `axios`, `cheerio`, `playwright`        |
| Search Engine      | `SQLite + FTS5`, fallback: `Lunr.js`    |
| DB Driver          | `better-sqlite3` or `sqlite3`           |
| Packaging          | `pkg`, `esbuild`, `npx`                 |
| Storage Location   | `~/.docu/` (cross-platform local data)  |

---

## 🧠 Implementation Plan

### 🏗️ 1. Project Setup
- Scaffold project using TypeScript
- Setup `tsconfig`, linting, prettier, ESModules
- Setup folder structure based on clean architecture

### 🧪 2. CLI Interface
- Use `commander` to define:
  - `docu fetch <docset>`
  - `docu search <query>`
  - `docu list`
  - `docu remove <docset>`

### 📥 3. Fetch & Normalize Docs
- Use scrapers to extract:
  - Titles, headings, paragraphs
- Normalize and save to: `~/.docu/<docset>/`
- Save metadata like version, updated date

### 📊 4. Indexing Engine
- Tokenize content using full-text search rules
- Index using SQLite FTS5 or fallback to Lunr
- Store in: `~/.docu/index/<docset>.db`

### 🔎 5. Fuzzy Search
- Perform ranked search on indexed content
- CLI output: matched title + snippet
- Optional: use Ink for preview-based TUI mode

### 📦 6. Docset Management
- `list`: show installed docsets
- `remove`: delete cached files and index
- `sync`: update if connected to internet

### 🚀 7. Packaging
- Bundle into a single binary with `pkg`
- Publish to `npm` with `npx` support

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
````

---

## 🧰 Example Commands

```bash
# Fetch a docset
docu fetch react

# Search offline docs
docu search useEffect

# List available docsets
docu list

# Remove cached docset
docu remove nodejs
```

---

## 🌱 Future Enhancements

* 🔎 AI-powered summary: `docu explain useEffect`
* 💡 VS Code Extension: inline doc search
* 📄 Export results/snippets to PDF
* 🔖 Bookmarks and annotations
* 📤 Share docsets with team over LAN
* 🔄 Automatic background updates

---

## 🤖 Contribution Guidelines

* Maintain SOLID principles
* Follow clean architecture folder layout
* Add tests using `jest`
* Open issues before large changes

---

## 📦 Packaging & Distribution

* Build: `npm run build`
* Package: `pkg .`
* Install globally: `npm i -g .`
* Publish: `npm publish`

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

* SQLite is preferred for long-term performance
* Modular scrapers support Markdown/HTML/JSON docs
* You can build your own docset with simple config

---
