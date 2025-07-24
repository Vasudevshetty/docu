import React from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';

interface HelpScreenProps {
  onNavigate: (screen: Screen, options?: any) => void;
}

export function HelpScreen({ onNavigate }: HelpScreenProps) {
  useInput((input: string, key: any) => {
    if (key.escape || input === 'q') {
      onNavigate('dashboard');
    }
  });

  const shortcuts = [
    { key: '1', action: 'Go to Dashboard' },
    { key: '2', action: 'Go to Search' },
    { key: '3', action: 'Go to Docsets' },
    { key: '4', action: 'Go to Settings' },
    { key: '?', action: 'Show this help' },
    { key: 'ESC', action: 'Go back / Exit' },
    { key: 'Ctrl+C', action: 'Exit application' },
  ];

  const searchHelp = [
    { key: 'Enter', action: 'Execute search' },
    { key: '↑↓', action: 'Navigate results' },
    { key: 'Enter', action: 'View selected result' },
    { key: '/', action: 'New search' },
    { key: 'ESC', action: 'Back to input / Dashboard' },
  ];

  const docsetHelp = [
    { key: '1/2', action: 'Switch between Installed/Available' },
    { key: 'Tab', action: 'Switch tabs' },
    { key: '↑↓', action: 'Navigate docsets' },
    { key: 'Enter', action: 'Select docset' },
    { key: 'R', action: 'Refresh list' },
  ];

  const viewerHelp = [
    { key: '↑↓ / J/K', action: 'Scroll up/down' },
    { key: 'PageUp/Down', action: 'Page up/down' },
    { key: 'G/g', action: 'Go to top/bottom' },
    { key: 'ESC', action: 'Back to search' },
    { key: 'Q', action: 'Back to dashboard' },
  ];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ❓ Help & Keyboard Shortcuts
        </Text>
      </Box>

      {/* Global shortcuts */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
        flexDirection="column"
      >
        <Box marginBottom={1}>
          <Text color="white" bold>
            🌐 Global Shortcuts
          </Text>
        </Box>

        {shortcuts.map((shortcut, index) => (
          <Box key={index} marginBottom={1}>
            <Box width={15}>
              <Text color="cyan" bold>
                {shortcut.key}
              </Text>
            </Box>
            <Text color="white">{shortcut.action}</Text>
          </Box>
        ))}
      </Box>

      {/* Search shortcuts */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
        flexDirection="column"
      >
        <Box marginBottom={1}>
          <Text color="white" bold>
            🔍 Search Screen
          </Text>
        </Box>

        {searchHelp.map((shortcut, index) => (
          <Box key={index} marginBottom={1}>
            <Box width={15}>
              <Text color="yellow" bold>
                {shortcut.key}
              </Text>
            </Box>
            <Text color="white">{shortcut.action}</Text>
          </Box>
        ))}
      </Box>

      {/* Docset shortcuts */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
        flexDirection="column"
      >
        <Box marginBottom={1}>
          <Text color="white" bold>
            📚 Docset Browser
          </Text>
        </Box>

        {docsetHelp.map((shortcut, index) => (
          <Box key={index} marginBottom={1}>
            <Box width={15}>
              <Text color="green" bold>
                {shortcut.key}
              </Text>
            </Box>
            <Text color="white">{shortcut.action}</Text>
          </Box>
        ))}
      </Box>

      {/* Viewer shortcuts */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
        flexDirection="column"
      >
        <Box marginBottom={1}>
          <Text color="white" bold>
            📖 Document Viewer
          </Text>
        </Box>

        {viewerHelp.map((shortcut, index) => (
          <Box key={index} marginBottom={1}>
            <Box width={15}>
              <Text color="blue" bold>
                {shortcut.key}
              </Text>
            </Box>
            <Text color="white">{shortcut.action}</Text>
          </Box>
        ))}
      </Box>

      {/* About */}
      <Box borderStyle="round" paddingX={2} paddingY={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text color="white" bold>
            📚 About docu-cli
          </Text>
        </Box>

        <Text color="gray">AI-powered offline documentation CLI tool</Text>

        <Text color="gray">
          Fetch, cache, and search developer docs from your terminal
        </Text>

        <Text color="gray">Created by @vasudevshetty</Text>

        <Text color="blue">https://github.com/Vasudevshetty/docu</Text>
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Press ESC or Q to return to Dashboard
        </Text>
      </Box>
    </Box>
  );
}
