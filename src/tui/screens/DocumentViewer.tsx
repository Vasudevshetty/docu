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
    } else {
      onNavigate('search');
    }
  }, [document]);

  const loadDocumentContent = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const formattedContent = createFormattedContent(document);
      setContent(formattedContent);
      setScrollPosition(0);
    } catch (error) {
      console.error('Failed to load document:', error);
      setContent('Failed to load document content');
    } finally {
      setLoading(false);
    }
  };

  const createFormattedContent = (doc: SearchResult): string => {
    const separator = '═'.repeat(80);
    const divider = '─'.repeat(80);

    return `${separator}
📖 ${doc.title}
${separator}

📚 Docset: ${doc.docset}
🔗 URL: ${doc.url}
⭐ Relevance Score: ${doc.score.toFixed(4)}
🕒 Last Updated: ${new Date().toLocaleDateString()}

${divider}
📄 CONTENT PREVIEW
${divider}

${doc.snippet ? doc.snippet.replace(/\*\*/g, '') : 'No preview available for this document.'}

${divider}
💡 ADDITIONAL INFORMATION
${divider}

This document is part of the ${doc.docset} documentation set.
In a full implementation, this would show the complete cached content.

To access the full documentation:
• Visit the original URL above
• Use the CLI command: docu search "${doc.title.substring(0, 30)}"
• Browse related documentation in the ${doc.docset} docset

${divider}
🎯 NAVIGATION HELP
${divider}

↑↓ or j/k    Scroll line by line
PgUp/PgDn     Scroll page by page  
Home/End      Go to start/end
ESC           Back to search results
q             Return to dashboard
/             Search within document (if available)

${separator}
End of Document
${separator}`;
  };

  const lines = content.split('\n');
  const maxScroll = Math.max(0, lines.length - 15);

  useInput((input: string, key: any) => {
    // Scroll navigation
    if (key.upArrow || input === 'k') {
      setScrollPosition(Math.max(0, scrollPosition - 1));
    }

    if (key.downArrow || input === 'j') {
      setScrollPosition(Math.min(maxScroll, scrollPosition + 1));
    }

    if (key.pageUp) {
      setScrollPosition(Math.max(0, scrollPosition - 10));
    }

    if (key.pageDown) {
      setScrollPosition(Math.min(maxScroll, scrollPosition + 10));
    }

    if (key.home) {
      setScrollPosition(0);
    }

    if (key.end) {
      setScrollPosition(maxScroll);
    }

    // Navigation
    if (key.escape) {
      onNavigate('search');
    }

    if (input === 'q') {
      onNavigate('dashboard');
    }
  });

  if (!document) {
    return (
      <Box
        flexDirection="column"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Text color="red" bold>
          No Document Selected
        </Text>
        <Text color="gray">Returning to search...</Text>
      </Box>
    );
  }

  const visibleLines = lines.slice(scrollPosition, scrollPosition + 15);
  const scrollPercent =
    maxScroll > 0 ? Math.round((scrollPosition / maxScroll) * 100) : 100;

  return (
    <Box flexDirection="column" height="100%" paddingX={1} paddingY={1}>
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
      >
        <Box flexDirection="column" width="100%">
          <Box justifyContent="space-between" marginBottom={1}>
            <Text color="cyan" bold>
              📖 Document Viewer
            </Text>
            <Text color="gray">
              Line {scrollPosition + 1}-
              {Math.min(scrollPosition + 15, lines.length)} of {lines.length} (
              {scrollPercent}%)
            </Text>
          </Box>
          <Box justifyContent="space-between">
            <Text color="gray">
              {document.title.length > 50
                ? document.title.substring(0, 50) + '...'
                : document.title}
            </Text>
            <Text color="gray">↑↓:Scroll • ESC:Back • q:Dashboard</Text>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box flexGrow={1} flexDirection="column">
        <Box
          borderStyle="round"
          borderColor="white"
          paddingX={2}
          paddingY={1}
          height="100%"
        >
          <Box flexDirection="column" width="100%">
            {loading ? (
              <Box justifyContent="center" alignItems="center" height="100%">
                <Text color="yellow">⟳ Loading document...</Text>
              </Box>
            ) : (
              <Box flexDirection="column">
                {visibleLines.map((line, index) => (
                  <Text key={scrollPosition + index} color="white">
                    {line || ' '}
                  </Text>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
        <Box justifyContent="space-between" width="100%">
          <Box>
            <Text color="gray">📚 {document.docset}</Text>
            <Text color="gray"> • </Text>
            <Text color="yellow">⭐ {document.score.toFixed(4)}</Text>
          </Box>
          <Box>
            {maxScroll > 0 && (
              <>
                <Text color="cyan">
                  {'█'.repeat(
                    Math.max(1, Math.floor((scrollPosition / maxScroll) * 10))
                  )}
                </Text>
                <Text color="gray">
                  {'░'.repeat(
                    Math.max(
                      0,
                      10 - Math.floor((scrollPosition / maxScroll) * 10)
                    )
                  )}
                </Text>
                <Text color="gray"> {scrollPercent}%</Text>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
