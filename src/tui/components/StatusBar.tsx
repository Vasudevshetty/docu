import React from 'react';
import { Box, Text } from 'ink';
import { Screen } from '../App.js';

interface StatusBarProps {
  currentScreen: Screen;
  isLoading: boolean;
}

export function StatusBar({ currentScreen, isLoading }: StatusBarProps) {
  const getScreenTitle = (screen: Screen): string => {
    switch (screen) {
      case 'dashboard':
        return 'Dashboard';
      case 'search':
        return 'Search';
      case 'docsets':
        return 'Docsets';
      case 'viewer':
        return 'Document';
      case 'settings':
        return 'Settings';
      case 'help':
        return 'Help';
      default:
        return 'Unknown';
    }
  };

  const shortcuts = [
    '1: Dashboard',
    '2: Search',
    '3: Docsets',
    '4: Settings',
    '?: Help',
    'ESC: Back',
    'Ctrl+C: Exit',
  ];

  return (
    <Box borderStyle="single" borderTop paddingX={1}>
      <Box flexGrow={1}>
        <Text color="cyan" bold>
          📚 docu-cli
        </Text>
        <Text color="gray"> • </Text>
        <Text color="white" bold>
          {getScreenTitle(currentScreen)}
        </Text>
        {isLoading && (
          <>
            <Text color="gray"> • </Text>
            <Text color="yellow">Loading...</Text>
          </>
        )}
      </Box>

      <Box gap={1}>
        {shortcuts.map((shortcut, index) => (
          <Text key={index} color="gray" dimColor>
            {shortcut}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
