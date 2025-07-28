---
title: Getting Started
description: Learn how to install and set up docu-cli for your development workflow
---

# Getting Started

Welcome to **docu-cli** - the AI-powered documentation management tool that revolutionizes how developers interact with documentation. This guide will get you up and running in minutes.

## What is docu-cli?

docu-cli is a blazing-fast, AI-enhanced command-line tool that allows you to:

- **📦 Fetch & Cache** complete documentation sets locally for offline access
- **🔍 Search Intelligently** with AI-powered explanations and contextual insights
- **🔖 Bookmark Smartly** build your personal knowledge base with advanced organization
- **⚡ Work Faster** with sub-second search across massive documentation collections

## Quick Installation

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** or **yarn** package manager
- **Terminal** or command prompt access

### Install Globally

```bash
# Install docu-cli globally via npm
npm install -g @vasudevshetty/docu-cli

# Verify installation
docu --version
# Output: docu-cli v0.4.0
```

### Alternative Installation Methods

```bash
# Using yarn
yarn global add @vasudevshetty/docu-cli

# Using npx (no installation required)
npx @vasudevshetty/docu-cli --help
```

## Initial Setup

### Interactive Configuration

Run the setup command to configure docu-cli for optimal performance:

```bash
docu setup
```

This interactive setup will guide you through:

1. **AI Configuration** - Set up Groq API for enhanced features
2. **Popular Docsets** - Choose initial documentation to download
3. **Performance Settings** - Optimize cache and search settings

### Manual Configuration

Create a configuration file at `~/.docu/.env`:

```env
# AI Enhancement (Optional but Recommended)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
GROQ_MAX_TOKENS=1024
GROQ_TEMPERATURE=0.1

# Cache Settings
DOCU_CACHE_SIZE=1000MB
DOCU_AUTO_UPDATE=true
DOCU_BACKUP_ENABLED=true

# Search Configuration
SEARCH_RESULT_LIMIT=10
SEARCH_MIN_SCORE=0.1
SEARCH_HIGHLIGHT=true
```

## First Usage

### 1. Fetch Your First Documentation Set

```bash
# Download React documentation
docu fetch react

# Output:
# 📥 Fetching React documentation...
# 📊 Found 15,423 documents
# 🔄 Indexing 15,423 documents...
# ✅ Successfully fetched and indexed react
```

### 2. Search and Explore

```bash
# Basic search
docu search "useState hook"

# AI-enhanced search (if configured)
docu search "useState hook" --ai

# Output:
# 🔍 Found 12 results for "useState hook":
#
# 1. ⭐ useState Hook - React Documentation [react]
#    useState is a Hook that lets you add React state to function components...
#    🔗 https://react.dev/reference/react/useState
#    💡 Score: 0.95 | 📅 Updated: 2 days ago
#
# 🤖 AI Insights:
# useState is the most fundamental React Hook for managing component state...
```

### 3. Create Your First Bookmark

```bash
# Bookmark important information
docu bookmark add "useState patterns" \
  --notes "Essential React hook for state management" \
  --tags "react,hooks,state,fundamentals" \
  --importance high

# Output:
# ✅ Bookmark added successfully!
#    ID: 550e8400-e29b-41d4-a716-446655440000
#    Title: useState Hook - React Documentation
#    Category: Frontend Framework (auto-detected)
#    Tags: #react #hooks #state #fundamentals
```

## Popular Documentation Sets

### Available Docsets

| Technology     | Command                 | Documents | Size |
| -------------- | ----------------------- | --------- | ---- |
| **React**      | `docu fetch react`      | ~15,400   | 52MB |
| **Vue.js**     | `docu fetch vue`        | ~5,400    | 18MB |
| **Angular**    | `docu fetch angular`    | ~8,200    | 31MB |
| **TypeScript** | `docu fetch typescript` | ~11,200   | 38MB |
| **Node.js**    | `docu fetch nodejs`     | ~18,900   | 67MB |
| **Python**     | `docu fetch python`     | ~18,900   | 67MB |
| **JavaScript** | `docu fetch javascript` | ~12,800   | 41MB |
| **Docker**     | `docu fetch docker`     | ~8,700    | 31MB |

### Bulk Installation

```bash
# Install multiple docsets at once
docu fetch react vue typescript nodejs

# Install popular frontend stack
docu fetch react typescript javascript

# Install full-stack development set
docu fetch react nodejs python docker
```

## Verification

### Check Installation

```bash
# Verify all components are working
docu --help
docu list
docu search "test" --limit 1
```

### View Storage Usage

```bash
docu list --stats

# Output:
# 📊 Storage Statistics:
#
# 📁 Cache Directory: ~/.docu/
# 💾 Total Size: 247 MB
# 📚 Docsets: 6 cached
# 🔖 Bookmarks: 0 total
#
# Breakdown by Docset:
# react        52 MB    (15,423 docs)
# typescript   38 MB    (11,234 docs)
# nodejs       67 MB    (18,956 docs)
```

## Troubleshooting

### Common Issues

**Command not found: docu**

```bash
# Check if npm global bin is in PATH
npm config get prefix
echo $PATH

# Reinstall if needed
npm uninstall -g @vasudevshetty/docu-cli
npm install -g @vasudevshetty/docu-cli
```

**Permission errors on macOS/Linux**

```bash
# Use sudo if needed (not recommended)
sudo npm install -g @vasudevshetty/docu-cli

# Better: Configure npm for global installs without sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Slow indexing performance**

```bash
# Check available disk space
df -h

# Clear cache if needed
docu remove --all
```

### Getting Help

```bash
# View all available commands
docu --help

# Get help for specific commands
docu search --help
docu bookmark --help
docu fetch --help
```

## Next Steps

Now that you have docu-cli installed and configured:

1. **[Explore Core Features](./core-features)** - Learn about documentation management, AI search, and bookmarking
2. **[Master CLI Commands](./cli-commands)** - Complete reference for all available commands
3. **[Advanced Configuration](./advanced-usage)** - Customize docu-cli for your specific workflow
4. **[Integration Guide](./integration-guide)** - Integrate with your IDE and development tools

## Quick Reference

| Action         | Command                                         |
| -------------- | ----------------------------------------------- |
| **Install**    | `npm install -g @vasudevshetty/docu-cli`        |
| **Setup**      | `docu setup`                                    |
| **Fetch Docs** | `docu fetch <docset>`                           |
| **Search**     | `docu search "<query>" --ai`                    |
| **Bookmark**   | `docu bookmark add "<title>" --notes "<notes>"` |
| **List Docs**  | `docu list --stats`                             |
| **Get Help**   | `docu --help`                                   |

---

🎉 **Congratulations!** You're now ready to experience the future of documentation management with docu-cli.
