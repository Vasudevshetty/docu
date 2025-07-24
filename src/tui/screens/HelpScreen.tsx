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
    <Box flexDirection="column" paddingX={3} paddingY={2}>
      {/* Header */}
      <Box marginBottom={2} justifyContent="center">
        <Text color="cyan" bold>
          docu-cli{' '}
        </Text>
        <Text color="white">Help & Keyboard Shortcuts</Text>
      </Box>

      <Box flexDirection="row" columnGap={3}>
        {/* Left Column - General & Search */}
        <Box width="50%">
          {/* General Shortcuts */}
          <Box
            borderStyle="round"
            paddingX={2}
            paddingY={1}
            marginBottom={2}
            flexDirection="column"
          >
            <Text color="cyan" bold>
              🎯 General Shortcuts
            </Text>
            <Box marginTop={1} flexDirection="column" rowGap={0}>
              {shortcuts.map((shortcut, index) => (
                <Box key={index} justifyContent="space-between">
                  <Text color="yellow" bold>
                    {shortcut.key}
                  </Text>
                  <Text color="white">{shortcut.action}</Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Search Help */}
          <Box
            borderStyle="round"
            paddingX={2}
            paddingY={1}
            flexDirection="column"
          >
            <Text color="green" bold>
              🔍 Search Screen
            </Text>
            <Box marginTop={1} flexDirection="column" rowGap={0}>
              {searchHelp.map((help, index) => (
                <Box key={index} justifyContent="space-between">
                  <Text color="yellow" bold>
                    {help.key}
                  </Text>
                  <Text color="white">{help.action}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Column - Docsets & Viewer */}
        <Box width="50%">
          {/* Docset Help */}
          <Box
            borderStyle="round"
            paddingX={2}
            paddingY={1}
            marginBottom={2}
            flexDirection="column"
          >
            <Text color="blue" bold>
              📚 Docset Browser
            </Text>
            <Box marginTop={1} flexDirection="column" rowGap={0}>
              {docsetHelp.map((help, index) => (
                <Box key={index} justifyContent="space-between">
                  <Text color="yellow" bold>
                    {help.key}
                  </Text>
                  <Text color="white">{help.action}</Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Viewer Help */}
          <Box
            borderStyle="round"
            paddingX={2}
            paddingY={1}
            flexDirection="column"
          >
            <Text color="magenta" bold>
              📄 Document Viewer
            </Text>
            <Box marginTop={1} flexDirection="column" rowGap={0}>
              {viewerHelp.map((help, index) => (
                <Box key={index} justifyContent="space-between">
                  <Text color="yellow" bold>
                    {help.key}
                  </Text>
                  <Text color="white">{help.action}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box marginTop={2} justifyContent="center">
        <Text color="gray" dimColor>
          Press ESC or q to return to dashboard • github.com/Vasudevshetty/docu
        </Text>
      </Box>
    </Box>
  );
}
