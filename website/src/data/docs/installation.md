---
title: 'Installation'
description: 'Complete installation guide for docu-cli with setup instructions for all platforms'
category: 'getting-started'
order: 2
---

# Installation Guide

Get docu-cli running on your system in minutes with multiple installation options.

## 📦 Quick Installation

### NPM (Recommended)

```bash
# Install globally via npm
npm install -g @vasudevshetty/docu-cli

# Verify installation
docu --version
```

### From Source

```bash
# Clone the repository
git clone https://github.com/Vasudevshetty/docu.git
cd docu

# Install dependencies
npm install

# Build the project
npm run build

# Link for global usage
npm link

# Verify installation
docu --version
```

## ⚙️ Initial Setup

### First-time Configuration

```bash
# Run the interactive setup
docu setup

# This will:
# ✅ Create ~/.docu directory structure
# ✅ Initialize SQLite databases
# ✅ Configure AI integration (optional)
# ✅ Set up default preferences
```

### AI Integration Setup

To enable AI-powered explanations, you'll need a Groq API key:

1. **Get Groq API Key**:
   - Visit [Groq Console](https://console.groq.com)
   - Create account and generate API key

2. **Configure Environment**:

   ```bash
   # Option 1: Environment variable
   export GROQ_API_KEY="your-api-key-here"

   # Option 2: During setup
   docu setup
   # Follow prompts to enter API key
   ```

3. **Verify AI Integration**:
   ```bash
   docu search "react hooks" --ai
   ```

## 🚀 First Usage

### 1. Fetch Your First Docset

```bash
# Fetch React documentation
docu fetch react

# Output:
# 🚀 Fetching React documentation...
# ✅ Downloaded 1,247 pages
# 📊 Indexed 15,678 searchable entries
# 💾 Cached in ~/.docu/docsets/react/
# ⏱️  Completed in 23.4s
```

### 2. Search Documentation

```bash
# Basic search
docu search "useState hook"

# AI-enhanced search
docu search "react performance optimization" --ai

# Search specific docset
docu search "async patterns" --docset nodejs
```

### 3. Create Your First Bookmark

```bash
# Bookmark important information
docu bookmark add "useState patterns" \
  --notes "Essential React hook for state management" \
  --tags "react,hooks,state,fundamentals" \
  --importance high
```

## 🔧 System Requirements

### Minimum Requirements

- **Node.js**: 16.x or higher
- **RAM**: 512MB available
- **Storage**: 100MB for core installation
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

### Recommended Requirements

- **Node.js**: 18.x or higher
- **RAM**: 2GB available (for large docsets)
- **Storage**: 1GB for multiple docsets
- **Terminal**: Modern terminal with Unicode support

## 📁 Directory Structure

After installation, docu-cli creates the following structure:

```
~/.docu/
├── config/
│   ├── settings.json      # User preferences
│   ├── ai-config.json     # AI integration settings
│   └── docsets.json       # Available docsets registry
├── docsets/
│   ├── react/            # Cached React documentation
│   ├── nodejs/           # Cached Node.js documentation
│   └── ...               # Other cached docsets
├── indexes/
│   ├── react.db         # SQLite search index for React
│   ├── nodejs.db        # SQLite search index for Node.js
│   └── ...              # Other search indexes
├── bookmarks/
│   └── bookmarks.db     # Personal bookmarks database
└── cache/
    ├── downloads/       # Temporary download cache
    └── metadata/        # Docset metadata cache
```

## 🛠️ Platform-Specific Notes

### Windows

- Use PowerShell or Windows Terminal for best experience
- Ensure Windows Defender doesn't block SQLite operations
- Consider Windows Subsystem for Linux (WSL) for optimal performance

### macOS

- No additional configuration required
- Works seamlessly with Terminal.app, iTerm2, and other terminals
- Spotlight indexing may briefly scan the ~/.docu directory

### Linux

- Ensure `sqlite3` is available in your system
- For optimal performance, consider using `zsh` with completion scripts
- Some distributions may require additional SQLite development packages

## 🔄 Updating docu-cli

### NPM Installation

```bash
# Update to latest version
npm update -g @vasudevshetty/docu-cli

# Force reinstall if needed
npm uninstall -g @vasudevshetty/docu-cli
npm install -g @vasudevshetty/docu-cli
```

### Source Installation

```bash
# Navigate to docu directory
cd path/to/docu

# Pull latest changes
git pull origin main

# Rebuild
npm run build
```

## ❌ Troubleshooting

### Common Issues

**Command not found: docu**

```bash
# Check if globally installed
npm list -g @vasudevshetty/docu-cli

# Check PATH
echo $PATH | grep npm

# Fix: Add npm global bin to PATH
export PATH=$PATH:$(npm prefix -g)/bin
```

**Permission denied on ~/.docu**

```bash
# Fix permissions
chmod -R 755 ~/.docu

# Or use sudo for npm install (not recommended)
sudo npm install -g @vasudevshetty/docu-cli
```

**SQLite errors on Linux**

```bash
# Install SQLite development package
sudo apt-get install sqlite3 libsqlite3-dev  # Ubuntu/Debian
sudo yum install sqlite-devel                # CentOS/RHEL
```

**AI features not working**

```bash
# Check API key configuration
docu setup --reconfigure

# Test connection
docu search "test" --ai
```

### Getting Help

- **Documentation**: Visit the complete documentation
- **Issues**: Report bugs on [GitHub Issues](https://github.com/Vasudevshetty/docu/issues)
- **Discussions**: Join community discussions
- **Support**: Contact support for enterprise users

---

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] `docu --version` shows version number
- [ ] `docu setup` completes successfully
- [ ] `docu available` lists available docsets
- [ ] `docu fetch react` downloads documentation
- [ ] `docu search "useState"` returns results
- [ ] `docu bookmark add "test"` creates bookmark
- [ ] AI features work (if configured)

🎉 **Congratulations!** You're now ready to experience the future of documentation management with docu-cli.
