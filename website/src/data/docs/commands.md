---
title: 'Commands Reference'
description: 'Complete reference for all docu-cli commands with examples and advanced usage patterns'
category: 'core'
order: 3
---

# Commands Reference

Complete reference for all docu-cli commands, organized by functionality with practical examples and advanced usage patterns.

## 📦 Core Commands

### `docu fetch`

Download and index documentation sets for offline access.

**Syntax:**

```bash
docu fetch <docset> [options]
docu fetch <docset1> <docset2> ... [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--force` | Force re-download even if cached | `false` |
| `--no-index` | Download without indexing | `false` |
| `--parallel <n>` | Parallel downloads | `4` |
| `--timeout <ms>` | Request timeout | `30000` |

**Examples:**

```bash
# Fetch single docset
docu fetch react

# Fetch multiple docsets
docu fetch react vue typescript

# Force re-download
docu fetch react --force

# Parallel download with custom settings
docu fetch nodejs python --parallel 8 --timeout 60000
```

### `docu search`

Search through cached documentation with AI insights.

**Syntax:**

```bash
docu search "<query>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--ai` | Enable AI explanations | `false` |
| `--docset <name>` | Search specific docset | `all` |
| `--limit <n>` | Maximum results | `10` |
| `--format <type>` | Output format: table, json, markdown | `table` |
| `--pager` | Use pager for results | `false` |
| `--min-score <n>` | Minimum relevance score | `0.1` |

**Examples:**

```bash
# Basic search
docu search "useState hook"

# AI-enhanced search
docu search "react performance optimization" --ai

# Search specific docset
docu search "async await" --docset javascript --limit 5

# JSON output for scripting
docu search "docker compose" --format json --limit 20

# Paginated results
docu search "python decorators" --pager --limit 50
```

### `docu list`

List all cached docsets with statistics.

**Syntax:**

```bash
docu list [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--verbose` | Show detailed information | `false` |
| `--stats` | Show storage statistics | `false` |
| `--json` | Output as JSON | `false` |

**Examples:**

```bash
# Basic list
docu list

# Detailed information
docu list --verbose --stats

# JSON output
docu list --json > docsets.json
```

### `docu remove`

Remove cached documentation sets.

**Syntax:**

```bash
docu remove <docset> [options]
docu remove --all [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--confirm` | Skip confirmation | `false` |
| `--keep-bookmarks` | Preserve bookmarks | `false` |

**Examples:**

```bash
# Remove specific docset
docu remove react

# Remove all cached data
docu remove --all

# Remove but keep bookmarks
docu remove vue --keep-bookmarks
```

## 🔖 Bookmark Commands

### `docu bookmark add`

Add bookmarks to your personal knowledge base.

**Syntax:**

```bash
docu bookmark add "<query>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--notes "<text>"` | Personal notes | `""` |
| `--tags "<tags>"` | Comma-separated tags | `""` |
| `--importance <level>` | high, medium, low | `medium` |
| `--docset <name>` | Associate with docset | `auto` |
| `--interactive` | Select from results | `false` |

**Examples:**

```bash
# Basic bookmark
docu bookmark add "React Error Boundaries"

# Detailed bookmark
docu bookmark add "useState patterns" \
  --notes "Essential React hook for state management" \
  --tags "react,hooks,state,fundamentals" \
  --importance high

# Interactive selection
docu bookmark add "async patterns" --interactive
```

### `docu bookmark list`

List and filter your bookmarks.

**Syntax:**

```bash
docu bookmark list [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--tag "<tag>"` | Filter by tag | `all` |
| `--docset <name>` | Filter by docset | `all` |
| `--importance <level>` | Filter by importance | `all` |
| `--recent` | Show recent bookmarks | `false` |
| `--limit <n>` | Maximum results | `50` |
| `--json` | JSON output | `false` |

**Examples:**

```bash
# List all bookmarks
docu bookmark list

# Filter by tag and importance
docu bookmark list --tag react --importance high

# Recent bookmarks
docu bookmark list --recent --limit 10

# Export to JSON
docu bookmark list --json > my-bookmarks.json
```

### `docu bookmark search`

Search through your bookmarks.

**Syntax:**

```bash
docu bookmark search "<query>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--tag "<tag>"` | Include tag filter | `""` |
| `--docset <name>` | Filter by docset | `""` |
| `--limit <n>` | Maximum results | `20` |
| `--pager` | Use pager | `false` |

**Examples:**

```bash
# Search bookmark titles
docu bookmark search "state management"

# Combined search and filter
docu bookmark search "hooks" --tag react --limit 10

# Paginated search
docu bookmark search "performance" --pager
```

### `docu bookmark remove`

Remove bookmarks from your collection.

**Syntax:**

```bash
docu bookmark remove <id> [options]
docu bookmark remove --tag "<tag>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--confirm` | Skip confirmation | `false` |
| `--tag "<tag>"` | Remove by tag | `""` |

**Examples:**

```bash
# Remove specific bookmark
docu bookmark remove 550e8400-e29b-41d4-a716-446655440000

# Remove by tag
docu bookmark remove --tag "outdated"

# Force remove without confirmation
docu bookmark remove --tag "temporary" --confirm
```

### `docu bookmark stats`

View bookmark statistics and analytics.

**Syntax:**

```bash
docu bookmark stats [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--detailed` | Show detailed breakdown | `false` |
| `--export <file>` | Export stats to file | `""` |

**Examples:**

```bash
# Basic statistics
docu bookmark stats

# Detailed analytics
docu bookmark stats --detailed

# Export statistics
docu bookmark stats --export bookmark-analytics.json
```

## 🤖 AI Commands

### `docu explain`

Get AI-powered explanations of concepts.

**Syntax:**

```bash
docu explain "<query>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--docset <name>` | Context from docset | `auto` |
| `--detailed` | Extended explanation | `false` |
| `--examples` | Include code examples | `true` |

**Examples:**

```bash
# Basic explanation
docu explain "react hooks"

# Detailed explanation with context
docu explain "async await patterns" --docset javascript --detailed

# Quick explanation
docu explain "docker volumes" --examples
```

### `docu quick`

Quick reference with AI-generated examples.

**Syntax:**

```bash
docu quick "<query>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--ai` | AI enhancement | `true` |
| `--format <type>` | Output format | `markdown` |

**Examples:**

```bash
# Quick reference
docu quick "react useCallback"

# AI-enhanced quick reference
docu quick "python list comprehension" --ai

# Different output format
docu quick "css flexbox" --format table
```

## 🛠️ Utility Commands

### `docu available`

Browse available docsets.

**Syntax:**

```bash
docu available [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--search <term>` | Search docsets | `""` |
| `--category <cat>` | Filter by category | `all` |
| `--json` | JSON output | `false` |

**Examples:**

```bash
# List all available docsets
docu available

# Search for specific docsets
docu available --search javascript

# Filter by category
docu available --category frontend
```

### `docu interactive`

Enter interactive search mode.

**Syntax:**

```bash
docu interactive [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--ai` | Enable AI by default | `false` |
| `--docset <name>` | Default docset | `all` |

**Examples:**

```bash
# Basic interactive mode
docu interactive

# AI-enhanced interactive mode
docu interactive --ai

# Docset-specific interactive mode
docu interactive --docset react
```

### `docu copy`

Copy search results to clipboard.

**Syntax:**

```bash
docu copy "<query>" [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--format <type>` | Copy format: code, markdown, url | `code` |
| `--first` | Copy only first result | `false` |

**Examples:**

```bash
# Copy first search result
docu copy "react useState" --first

# Copy as markdown
docu copy "docker compose example" --format markdown
```

### `docu export`

Export search results or bookmarks.

**Syntax:**

```bash
docu export <type> [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--format <type>` | Export format | `json` |
| `--output <file>` | Output file | `stdout` |

**Examples:**

```bash
# Export bookmarks
docu export bookmarks --format json --output bookmarks.json

# Export search results
docu search "react" --export --format markdown
```

### `docu update`

Update cached documentation.

**Syntax:**

```bash
docu update [docset] [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--all` | Update all docsets | `false` |
| `--check-only` | Check for updates only | `false` |

**Examples:**

```bash
# Update specific docset
docu update react

# Update all cached docsets
docu update --all

# Check for updates
docu update --check-only
```

## 🌐 Global Options

These options work with most commands:

| Option            | Description            |
| ----------------- | ---------------------- |
| `--help, -h`      | Show command help      |
| `--version, -V`   | Show version           |
| `--verbose, -v`   | Verbose output         |
| `--quiet, -q`     | Suppress output        |
| `--config <path>` | Custom config file     |
| `--no-color`      | Disable colored output |

## 📋 Usage Patterns

### Daily Development Workflow

```bash
# Morning: Check recent bookmarks
docu bookmark list --recent --limit 5

# During development: Quick lookups
docu quick "react useCallback" --ai
docu search "typescript generic constraints" --pager

# Problem solving: Search and bookmark
docu search "javascript memory leaks" --ai
docu bookmark add "memory leak prevention" \
  --notes "Critical patterns for production" \
  --tags "javascript,performance,memory"

# End of day: Review and organize
docu bookmark stats
docu bookmark list --tag "today" --importance high
```

### Learning New Technology

```bash
# Setup learning environment
docu fetch vue
docu bookmark add "vue learning path" \
  --tags "learning,vue,week1" \
  --notes "Starting Vue.js journey"

# Structured learning
docu search "vue composition api" --ai
docu bookmark add "composition api basics" \
  --tags "learning,vue,composition-api"

# Progress tracking
docu bookmark search "learning vue"
docu bookmark stats --detailed
```

### Team Knowledge Sharing

```bash
# Export team standards
docu bookmark list --tag "team-standards" --json > standards.json

# Document best practices
docu bookmark add "error handling patterns" \
  --notes "Team standard: Use custom error classes" \
  --tags "team,standards,error-handling"

# Code review support
docu quick "react performance patterns" --ai
docu bookmark add "performance anti-pattern" \
  --notes "Found in PR #123 - avoid this" \
  --tags "review,performance,anti-patterns"
```

## 🔧 Command Completion

Enable command completion for your shell:

**Bash:**

```bash
docu completion bash >> ~/.bashrc
source ~/.bashrc
```

**Zsh:**

```bash
docu completion zsh >> ~/.zshrc
source ~/.zshrc
```

**Fish:**

```bash
docu completion fish > ~/.config/fish/completions/docu.fish
```

---

> 💡 **Pro Tip**: Use `docu <command> --help` for detailed help on any specific command, and `docu interactive --ai` for an enhanced search experience.
