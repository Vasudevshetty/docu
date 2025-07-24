import React from 'react';
import { Box, Text } from 'ink';
import { Screen } from '../App.js';

interface StatusBarProps {
  currentScreen: Screen;
  isLoading: boolean;
}

export function StatusBar({ currentScreen, isLoading }: StatusBarProps) {
  const getQuickActions = (screen: Screen) => {
    const base = ['1:Search', '2:Docsets', '3:Available', '4:Settings'];

    switch (screen) {
      case 'search':
        return ['Enter:Search', '↑↓:Navigate', 'Enter:View', 'ESC:Back'];
      case 'docsets':
        return ['↑↓:Navigate', 'Enter:Manage', 'd:Delete', 'ESC:Back'];
      case 'available':
        return ['↑↓:Navigate', 'Enter:Install', 'i:Info', 'ESC:Back'];
      case 'viewer':
        return ['↑↓:Scroll', 'PgUp/PgDn:Page', 'ESC:Back'];
      case 'settings':
        return ['↑↓:Navigate', 'Enter:Edit', 'ESC:Back'];
      case 'help':
        return ['↑↓:Scroll', 'ESC:Back'];
      default:
        return base;
    }
  };

  const actions = getQuickActions(currentScreen);

  return (
    <Box borderStyle="single" borderColor="gray" paddingX={2} paddingY={0}>
      <Box justifyContent="space-between" width="100%">
        {/* Left: Quick actions for current screen */}
        <Box>
          {actions.map((action, index) => (
            <React.Fragment key={action}>
              {index > 0 && <Text color="gray"> • </Text>}
              <Text color="cyan">{action.split(':')[0]}</Text>
              <Text color="gray">:{action.split(':')[1]}</Text>
            </React.Fragment>
          ))}
        </Box>

        {/* Right: Global shortcuts */}
        <Box>
          <Text color="gray">
            h:Help • ESC:Home • q:Quit
            {isLoading && <Text color="yellow"> • ⟳ Loading</Text>}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
