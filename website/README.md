# docu-cli Website

Modern, clean documentation website for docu-cli built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   ├── page.tsx           # Landing page
│   │   └── docs/              # Documentation routes
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── docs-layout.tsx    # Documentation layout
│   │   ├── docs-content.tsx   # Documentation content renderer
│   │   └── theme-toggle.tsx   # Dark/light theme toggle
│   ├── data/                  # Content and metadata
│   │   ├── metadata.json      # Site metadata and navigation
│   │   └── docs/              # Markdown documentation files
│   ├── lib/                   # Utility functions
│   │   ├── docs.ts            # Documentation processing
│   │   └── utils.ts           # General utilities
│   └── styles/
│       └── globals.css        # Global styles with Tailwind
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Design System

### Theme Support

- **Dual Themes**: Clean light and dark modes
- **System Detection**: Automatic theme based on OS preference
- **Smooth Transitions**: Animated theme switching

### Color Palette

- **Light Mode**: Clean whites and subtle grays
- **Dark Mode**: Deep blacks with soft contrasts
- **No Gradients**: Pure, professional aesthetic

### Typography

- **Headings**: Bold, clear hierarchy
- **Body**: Readable sans-serif
- **Code**: Monospace with syntax highlighting

## 🧩 Component Architecture

### Layout Components

- `DocsLayout`: Sticky sidebar navigation with responsive design
- `ThemeProvider`: Theme context and system integration
- `ThemeToggle`: Theme switching with icons

### Content Components

- `DocsContent`: Markdown rendering with TOC and copy buttons
- `Button`: Consistent button component with variants
- `Navigation`: Collapsible sidebar navigation

### Features

- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Static generation and optimized assets
- **SEO**: Meta tags and structured data

## 📝 Content Management

### Documentation Files

- **Location**: `src/data/docs/*.md`
- **Format**: Markdown with frontmatter
- **Processing**: Gray-matter + Marked.js

### Metadata System

- **Navigation**: Defined in `metadata.json`
- **Icons**: React Icons integration
- **Structure**: Hierarchical organization

### Adding Documentation

1. Create new `.md` file in `src/data/docs/`
2. Add frontmatter with title and description
3. Update `metadata.json` navigation
4. Add to `generateStaticParams` in `[slug]/page.tsx`

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: TypeScript type checking

### Environment Variables

```env
# Not required for basic functionality
NEXT_PUBLIC_SITE_URL=https://docu.vasudevshetty.com
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Consistent formatting
- **Tailwind**: Utility-first CSS

## 🚀 Deployment

### Static Export

```bash
npm run build
# Creates `out/` directory with static files
```

### Deployment Targets

- **Vercel**: Automatic deployment from Git
- **Netlify**: Static hosting with forms
- **GitHub Pages**: Static hosting
- **Custom**: Any static hosting provider

### Domain Setup

- Configure DNS for `docu.vasudevshetty.com`
- SSL certificate automatic on most platforms
- CDN integration for global performance

## 📊 Performance

### Optimization Features

- **Static Generation**: Pre-built pages
- **Image Optimization**: Next.js automatic optimization
- **Bundle Splitting**: Automatic code splitting
- **CSS Optimization**: Tailwind purging

### Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🛠️ Customization

### Theming

- Modify `tailwind.config.js` for colors
- Update CSS variables in `globals.css`
- Customize component variants in `ui/` directory

### Content

- Edit documentation in `src/data/docs/`
- Update navigation in `metadata.json`
- Modify landing page in `app/page.tsx`

### Styling

- Tailwind classes for rapid development
- CSS modules for component-specific styles
- CSS variables for theme consistency

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test locally
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push branch: `git push origin feature/amazing-feature`
6. Open Pull Request

### Guidelines

- Follow existing code style
- Add TypeScript types for new components
- Test responsive design on multiple devices
- Update documentation for new features

---

Built with ❤️ for the developer community.
