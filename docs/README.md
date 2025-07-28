# docu-cli Documentation

Welcome to the comprehensive documentation for docu-cli - the AI-powered offline documentation management tool.

## 📚 Table of Contents

### Getting Started

- [Installation & Setup](../README.md#installation)
- [Quick Start Guide](./getting-started.md)
- [Configuration](./configuration.md)

### Core Features

- [📦 Documentation Management](./features/documentation-management.md)
- [🔍 Smart Search](./features/smart-search.md)
- [🤖 AI Integration](./features/ai-integration.md)
- [🔖 Bookmark System](./features/bookmark-system.md)
- [📊 Analytics & Insights](./features/analytics.md)
- [🎨 User Interface](./features/user-interface.md)

### Command Reference

- [Core Commands](./api/core-commands.md)
- [Bookmark Commands](./api/bookmark-commands.md)
- [AI Commands](./api/ai-commands.md)
- [Utility Commands](./api/utility-commands.md)

### Development

- [Architecture Overview](./development/architecture.md)
- [Testing Configuration](./development/testing.md)
- [Contributing Guidelines](./development/contributing.md)
- [API Reference](./development/api-reference.md)

### Examples & Tutorials

- [Daily Workflow Examples](./examples/daily-workflow.md)
- [Learning Path Setup](./examples/learning-paths.md)
- [Team Knowledge Sharing](./examples/team-collaboration.md)

## 🚀 Quick Reference

### Most Common Commands

```bash
# Setup and fetch documentation
docu setup
docu fetch react

# Search and bookmark
docu search "useState" --ai
docu bookmark add "useState" --notes "React state management"

# Personal knowledge management
docu bookmark list --tag hooks
docu bookmark search "state management"
docu bookmark stats
```

### Key Features at a Glance

| Feature          | Command                     | Description                      |
| ---------------- | --------------------------- | -------------------------------- |
| **Fetch Docs**   | `docu fetch <docset>`       | Download documentation offline   |
| **Smart Search** | `docu search <query> --ai`  | AI-enhanced search with insights |
| **Bookmark**     | `docu bookmark add <query>` | Save documentation snippets      |
| **Quick Ref**    | `docu quick <query>`        | Fast syntax lookup               |
| **Explain**      | `docu explain <concept>`    | AI-powered explanations          |
| **Analytics**    | `docu bookmark stats`       | Personal usage insights          |

## 🎯 Use Case Scenarios

### For Individual Developers

- **Learning New Technologies**: Bookmark key concepts and examples
- **Daily Development**: Quick access to frequently used patterns
- **Knowledge Building**: Create personal reference collections

### For Teams

- **Onboarding**: Share curated learning paths
- **Best Practices**: Bookmark and share recommended patterns
- **Knowledge Management**: Organized team documentation

### For Organizations

- **Productivity**: Reduced time searching for solutions
- **Learning Analytics**: Insights into team learning patterns
- **Offline Development**: Work anywhere without internet dependency

## 🔗 Related Resources

- [GitHub Repository](https://github.com/Vasudevshetty/docu)
- [NPM Package](https://www.npmjs.com/package/@vasudevshetty/docu-cli)
- [Issues & Feature Requests](https://github.com/Vasudevshetty/docu/issues)
- [Changelog](../CHANGELOG.md)

---

**Need help?** Check our [FAQ](./faq.md) or [open an issue](https://github.com/Vasudevshetty/docu/issues/new).
