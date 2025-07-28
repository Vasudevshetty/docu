---
title: CLI Commands Reference
description: Complete reference for all docu-cli commands with examples and options
---

# CLI Commands Reference

This comprehensive reference covers all available commands in docu-cli. Each command includes syntax, options, examples, and use cases.

## Core Commands

### `docu fetch`

Download and index documentation sets for offline access.

#### Syntax

```bash
docu fetch <docset> [options]
docu fetch <docset1> <docset2> ... [options]
```

#### Options

| Option           | Description                              | Default |
| ---------------- | ---------------------------------------- | ------- |
| `--force`        | Force re-download even if already cached | `false` |
| `--no-index`     | Download without indexing (faster)       | `false` |
| `--parallel <n>` | Number of parallel downloads             | `4`     |
| `--timeout <ms>` | Request timeout in milliseconds          | `30000` |

#### Examples

```bash
# Fetch single docset
docu fetch react

# Fetch multiple docsets
docu fetch react vue typescript

# Force re-download and re-index
docu fetch react --force

# Parallel download with custom settings
docu fetch nodejs python --parallel 8 --timeout 60000
```

#### Available Docsets

```bash
# View all available docsets
docu available

# Search for specific docsets
docu available --search javascript
```

### `docu search`

Search through cached documentation with optional AI enhancement.

#### Syntax

```bash
docu search "<query>" [options]
```

#### Options

| Option            | Description                          | Default |
| ----------------- | ------------------------------------ | ------- |
| `--ai`            | Enable AI-powered explanations       | `false` |
| `--docset <name>` | Search within specific docset        | `all`   |
| `--limit <n>`     | Maximum number of results            | `10`    |
| `--format <type>` | Output format: table, json, markdown | `table` |
| `--pager`         | Use pager for large results          | `false` |
| `--min-score <n>` | Minimum relevance score (0-1)        | `0.1`   |

#### Examples

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

### `docu explain`

Get detailed AI explanations for concepts and code patterns.

#### Syntax

```bash
docu explain "<concept>" [options]
```

#### Options

| Option               | Description                     | Default |
| -------------------- | ------------------------------- | ------- |
| `--simple`           | Simple explanation mode         | `false` |
| `--examples`         | Include code examples           | `true`  |
| `--pager`            | Use pager for long explanations | `false` |
| `--context <docset>` | Use specific docset for context | `auto`  |

#### Examples

```bash
# Detailed explanation
docu explain "react useEffect cleanup"

# Simple explanation
docu explain "javascript closures" --simple

# With code examples
docu explain "python decorators" --examples --pager

# Context-specific explanation
docu explain "async patterns" --context javascript
```

### `docu quick`

Quick reference lookup for syntax and patterns.

#### Syntax

```bash
docu quick "<syntax>" [options]
```

#### Options

| Option            | Description                 | Default    |
| ----------------- | --------------------------- | ---------- |
| `--ai`            | AI-enhanced quick reference | `false`    |
| `--copy`          | Copy result to clipboard    | `false`    |
| `--format <type>` | Output format               | `markdown` |

#### Examples

```bash
# Quick syntax lookup
docu quick "react useState syntax"

# AI-enhanced quick reference
docu quick "async await error handling" --ai

# Copy to clipboard
docu quick "docker compose syntax" --copy
```

## Bookmark Commands

### `docu bookmark add`

Add a bookmark to your personal knowledge base.

#### Syntax

```bash
docu bookmark add "<title>" [options]
```

#### Options

| Option                 | Description                       | Default  |
| ---------------------- | --------------------------------- | -------- |
| `--notes "<text>"`     | Personal notes about the bookmark | `""`     |
| `--tags "<tags>"`      | Comma-separated tags              | `""`     |
| `--importance <level>` | Importance: high, medium, low     | `medium` |
| `--url "<url>"`        | Custom URL (if not from search)   | `auto`   |
| `--docset "<name>"`    | Associate with specific docset    | `auto`   |

#### Examples

```bash
# Basic bookmark
docu bookmark add "React Error Boundaries"

# Detailed bookmark
docu bookmark add "useState patterns" \
  --notes "Essential React hook for state management" \
  --tags "react,hooks,state,fundamentals" \
  --importance high

# Custom URL bookmark
docu bookmark add "Company API Docs" \
  --url "https://docs.company.com/api" \
  --tags "api,internal,documentation" \
  --notes "Internal API reference for project X"
```

### `docu bookmark list`

List and filter your bookmarks.

#### Syntax

```bash
docu bookmark list [options]
```

#### Options

| Option                 | Description                | Default |
| ---------------------- | -------------------------- | ------- |
| `--tag "<tag>"`        | Filter by tag              | `all`   |
| `--docset "<name>"`    | Filter by docset           | `all`   |
| `--importance <level>` | Filter by importance       | `all`   |
| `--recent`             | Show only recent bookmarks | `false` |
| `--limit <n>`          | Maximum number of results  | `50`    |
| `--format <type>`      | Output format              | `table` |

#### Examples

```bash
# List all bookmarks
docu bookmark list

# Filter by tag
docu bookmark list --tag react --importance high

# Recent bookmarks
docu bookmark list --recent --limit 10

# Export to JSON
docu bookmark list --format json > my-bookmarks.json
```

### `docu bookmark search`

Search through your bookmarks.

#### Syntax

```bash
docu bookmark search "<query>" [options]
```

#### Options

| Option          | Description             | Default |
| --------------- | ----------------------- | ------- |
| `--tag "<tag>"` | Include tag filter      | `""`    |
| `--notes`       | Search in notes content | `false` |
| `--limit <n>`   | Maximum results         | `20`    |

#### Examples

```bash
# Search bookmark titles
docu bookmark search "state management"

# Search in notes
docu bookmark search "performance" --notes

# Combined search
docu bookmark search "hooks" --tag react --limit 10
```

### `docu bookmark remove`

Remove bookmarks from your collection.

#### Syntax

```bash
docu bookmark remove <id> [options]
docu bookmark remove --tag "<tag>" [options]
```

#### Options

| Option          | Description                   | Default |
| --------------- | ----------------------------- | ------- |
| `--confirm`     | Skip confirmation prompt      | `false` |
| `--tag "<tag>"` | Remove all bookmarks with tag | `""`    |

#### Examples

```bash
# Remove specific bookmark
docu bookmark remove 550e8400-e29b-41d4-a716-446655440000

# Remove by tag (with confirmation)
docu bookmark remove --tag "outdated"

# Force remove without confirmation
docu bookmark remove --tag "temporary" --confirm
```

### `docu bookmark stats`

View bookmark statistics and analytics.

#### Syntax

```bash
docu bookmark stats [options]
```

#### Options

| Option            | Description             | Default |
| ----------------- | ----------------------- | ------- |
| `--detailed`      | Show detailed breakdown | `false` |
| `--export <file>` | Export stats to file    | `""`    |

#### Examples

```bash
# Basic statistics
docu bookmark stats

# Detailed analytics
docu bookmark stats --detailed

# Export statistics
docu bookmark stats --export bookmark-analytics.json
```

## Management Commands

### `docu list`

List cached documentation sets and storage information.

#### Syntax

```bash
docu list [options]
```

#### Options

| Option            | Description                | Default |
| ----------------- | -------------------------- | ------- |
| `--stats`         | Include storage statistics | `false` |
| `--format <type>` | Output format              | `table` |
| `--sort <field>`  | Sort by: name, size, date  | `name`  |

#### Examples

```bash
# List all cached docsets
docu list

# Include storage stats
docu list --stats

# Sort by size
docu list --stats --sort size
```

### `docu remove`

Remove cached documentation sets.

#### Syntax

```bash
docu remove <docset> [options]
docu remove --all [options]
```

#### Options

| Option             | Description               | Default |
| ------------------ | ------------------------- | ------- |
| `--confirm`        | Skip confirmation prompt  | `false` |
| `--keep-bookmarks` | Keep associated bookmarks | `false` |

#### Examples

```bash
# Remove specific docset
docu remove react

# Remove all cached data
docu remove --all

# Remove but keep bookmarks
docu remove vue --keep-bookmarks
```

### `docu update`

Update cached documentation sets.

#### Syntax

```bash
docu update [docset] [options]
```

#### Options

| Option           | Description                 | Default |
| ---------------- | --------------------------- | ------- |
| `--all`          | Update all cached docsets   | `false` |
| `--force`        | Force update even if recent | `false` |
| `--parallel <n>` | Parallel update limit       | `4`     |

#### Examples

```bash
# Update specific docset
docu update react

# Update all docsets
docu update --all

# Force update with parallel processing
docu update --all --force --parallel 8
```

## Utility Commands

### `docu setup`

Interactive setup and configuration.

#### Syntax

```bash
docu setup [options]
```

#### Options

| Option      | Description                | Default |
| ----------- | -------------------------- | ------- |
| `--reset`   | Reset all configuration    | `false` |
| `--ai-only` | Configure only AI settings | `false` |

#### Examples

```bash
# Full interactive setup
docu setup

# Reset configuration
docu setup --reset

# Configure only AI features
docu setup --ai-only
```

### `docu interactive`

Enter interactive search mode.

#### Syntax

```bash
docu interactive [options]
```

#### Options

| Option            | Description           | Default |
| ----------------- | --------------------- | ------- |
| `--ai`            | Enable AI by default  | `false` |
| `--docset <name>` | Default docset filter | `all`   |

#### Examples

```bash
# Basic interactive mode
docu interactive

# AI-enhanced interactive mode
docu interactive --ai

# Pre-filtered interactive mode
docu interactive --docset react
```

### `docu tui`

Launch Terminal User Interface.

#### Syntax

```bash
docu tui [options]
```

#### Examples

```bash
# Launch TUI
docu tui
```

### `docu copy`

Copy search results or bookmarks to clipboard.

#### Syntax

```bash
docu copy "<query>" [options]
```

#### Options

| Option            | Description                      | Default |
| ----------------- | -------------------------------- | ------- |
| `--format <type>` | Copy format: code, markdown, url | `code`  |
| `--first`         | Copy only first result           | `false` |

#### Examples

```bash
# Copy first search result
docu copy "react useState" --first

# Copy as markdown
docu copy "docker compose example" --format markdown
```

## Global Options

These options are available for most commands:

| Option            | Description                   |
| ----------------- | ----------------------------- |
| `--help, -h`      | Show command help             |
| `--version, -v`   | Show version information      |
| `--verbose`       | Enable verbose output         |
| `--quiet, -q`     | Suppress non-essential output |
| `--config <file>` | Use custom config file        |

## Examples by Use Case

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

---

## Command Completion

Enable shell completion for better CLI experience:

### Bash

```bash
# Add to ~/.bashrc
eval "$(docu completion bash)"
```

### Zsh

```bash
# Add to ~/.zshrc
eval "$(docu completion zsh)"
```

### Fish

```bash
# Add to ~/.config/fish/config.fish
docu completion fish | source
```

This completes the comprehensive CLI commands reference. Each command is designed to integrate seamlessly into your development workflow, whether you're doing quick lookups, building knowledge bases, or collaborating with teams.
