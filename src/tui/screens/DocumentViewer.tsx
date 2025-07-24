import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';
import { SearchResult } from '../../domain/Search.js';

interface DocumentViewerProps {
  onNavigate: (screen: Screen, options?: any) => void;
  document?: SearchResult;
}

export function DocumentViewer({ onNavigate, document }: DocumentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document) {
      loadDocumentContent();
    }
  }, [document]);

  const loadDocumentContent = async () => {
    if (!document) return;

    setLoading(true);
    try {
      // For now, we'll use the snippet or create a formatted view
      const formattedContent = createFormattedContent(document);
      setContent(formattedContent);
    } catch (error) {
      console.error('Failed to load document:', error);
      setContent('Failed to load document content');
    } finally {
      setLoading(false);
    }
  };

  const createFormattedContent = (doc: SearchResult): string => {
    return `# ${doc.title}

**Docset:** ${doc.docset}
**URL:** ${doc.url}
**Score:** ${doc.score.toFixed(3)}

---

## Content Preview

${doc.snippet || 'No preview available'}

---

*This is a preview of the search result. Full document content would be loaded from the cached files in a complete implementation.*

**Navigation:**
- Use ↑↓ or J/K to scroll
- ESC to go back to search
- Q to quit to dashboard
`;
  };

  const lines = content.split('\n');
  const terminalHeight = 20; // Approximate terminal height for content
  const visibleLines = lines.slice(
    scrollPosition,
    scrollPosition + terminalHeight
  );

  useInput((input: string, key: any) => {
    if (key.escape) {
      onNavigate('search');
      return;
    }

    if (input === 'q') {
      onNavigate('dashboard');
      return;
    }

    // Scroll navigation
    if (key.upArrow || input === 'k') {
      setScrollPosition(Math.max(0, scrollPosition - 1));
    }

    if (key.downArrow || input === 'j') {
      setScrollPosition(
        Math.min(lines.length - terminalHeight, scrollPosition + 1)
      );
    }

    // Page navigation
    if (key.pageUp) {
      setScrollPosition(Math.max(0, scrollPosition - terminalHeight));
    }

    if (key.pageDown) {
      setScrollPosition(
        Math.min(lines.length - terminalHeight, scrollPosition + terminalHeight)
      );
    }

    // Go to top/bottom
    if (input === 'g') {
      setScrollPosition(0);
    }

    if (input === 'G') {
      setScrollPosition(Math.max(0, lines.length - terminalHeight));
    }
  });

  if (!document) {
    return (
      <Box paddingX={2} paddingY={1} justifyContent="center">
        <Text color="yellow">No document selected</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box paddingX={2} paddingY={1} justifyContent="center">
        <Text color="yellow">Loading document...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📖 Document Viewer
        </Text>
      </Box>

      {/* Document info */}
      <Box borderStyle="round" paddingX={2} paddingY={1} marginBottom={1}>
        <Box flexDirection="column">
          <Text color="white" bold>
            {document.title}
          </Text>
          <Text color="gray" dimColor>
            {document.docset} • {document.url}
          </Text>
        </Box>
      </Box>

      {/* Content */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        flexGrow={1}
      >
        {visibleLines.map((line, index) => {
          const lineNumber = scrollPosition + index;

          // Simple markdown-like rendering
          if (line.startsWith('# ')) {
            return (
              <Text key={lineNumber} color="cyan" bold>
                {line.substring(2)}
              </Text>
            );
          }

          if (line.startsWith('## ')) {
            return (
              <Text key={lineNumber} color="blue" bold>
                {line.substring(3)}
              </Text>
            );
          }

          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <Text key={lineNumber} color="white" bold>
                {line.substring(2, line.length - 2)}
              </Text>
            );
          }

          if (line.startsWith('---')) {
            return (
              <Text key={lineNumber} color="gray">
                ──────────────────────────────────────
              </Text>
            );
          }

          if (line.startsWith('*') && line.endsWith('*')) {
            return (
              <Text key={lineNumber} color="gray" italic>
                {line.substring(1, line.length - 1)}
              </Text>
            );
          }

          return (
            <Text key={lineNumber} color="white">
              {line || ' '}
            </Text>
          );
        })}
      </Box>

      {/* Scroll indicator */}
      <Box marginTop={1} justifyContent="space-between">
        <Text color="gray" dimColor>
          Lines {scrollPosition + 1}-
          {Math.min(scrollPosition + terminalHeight, lines.length)} of{' '}
          {lines.length}
        </Text>
        <Text color="gray" dimColor>
          ↑↓/J/K: Scroll • G/g: Top/Bottom • ESC: Back • Q: Dashboard
        </Text>
      </Box>
    </Box>
  );
}
