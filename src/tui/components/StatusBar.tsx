import React from 'react';
import { Box, Text } from 'ink';
import { Screen } from '../App.js';

interface StatusBarProps {
  currentScreen: Screen;
  isLoading: boolean;
}

export function StatusBar({ currentScreen, isLoading }: StatusBarProps) {
  const getScreenInfo = (screen: Screen) => {
    const screens = {
      dashboard: { icon: '🏠', title: 'Dashboard', color: 'cyan' },
      search: { icon: '🔍', title: 'Search', color: 'green' },
      docsets: { icon: '📚', title: 'Docsets', color: 'blue' },
      viewer: { icon: '📖', title: 'Document', color: 'yellow' },
      settings: { icon: '⚙️', title: 'Settings', color: 'magenta' },
      help: { icon: '❓', title: 'Help', color: 'gray' },
    };
    return screens[screen] || { icon: '❓', title: 'Unknown', color: 'white' };
  };

  const currentInfo = getScreenInfo(currentScreen);
  const shortcuts = ['1:Search', '2:Docsets', '3:Settings', 'h:Help', 'q:Quit'];

  return (
    <Box borderStyle="single" borderColor="gray" paddingX={2}>
      <Box justifyContent="space-between" width="100%">
        {/* Left: Current Screen Info */}
        <Box>
          <Text color="cyan" bold>
            docu-cli
          </Text>
          <Text color="gray"> › </Text>
          <Text color={currentInfo.color as any}>
            {currentInfo.icon} {currentInfo.title}
          </Text>
          {isLoading && <Text color="yellow"> ⟳</Text>}
        </Box>

        {/* Right: Quick Shortcuts */}
        <Box>
          <Text color="gray">
            1:Search • 2:Docsets • 3:Settings • h:Help • q:Quit
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
