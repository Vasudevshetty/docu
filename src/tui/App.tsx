import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Banner } from '../utils/Banner.js';
import { StatusBar } from './components/StatusBar.js';
import { HelpScreen } from './screens/HelpScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { DocumentViewer } from './screens/DocumentViewer.js';
import { DocsetBrowser } from './screens/DocsetBrowser.js';
import { SearchScreen } from './screens/SearchScreen.js';
import { MainDashboard } from './screens/MainDashboard.js';

export type Screen =
  | 'dashboard'
  | 'search'
  | 'docsets'
  | 'viewer'
  | 'settings'
  | 'help';

interface AppState {
  currentScreen: Screen;
  selectedDocset?: string;
  searchQuery?: string;
  selectedDocument?: any;
  isLoading: boolean;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'dashboard',
    isLoading: false,
  });

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Hide banner after 2 seconds
    const timer = setTimeout(() => setShowBanner(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useInput((input: string, key: any) => {
    // Global hotkeys
    if (key.ctrl && input === 'c') {
      process.exit(0);
    }
    if (key.escape) {
      setState((prev: AppState) => ({ ...prev, currentScreen: 'dashboard' }));
    }
    // Navigation hotkeys
    switch (input) {
      case '1':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'dashboard',
        }));
        break;
      case '2':
        setState((prev: AppState) => ({ ...prev, currentScreen: 'search' }));
        break;
      case '3':
        setState((prev: AppState) => ({ ...prev, currentScreen: 'docsets' }));
        break;
      case '4':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'settings',
        }));
        break;
      case '?':
      case 'h':
        setState((prev: AppState) => ({ ...prev, currentScreen: 'help' }));
        break;
    }
  });

  const navigateToScreen = (screen: Screen, options?: Partial<AppState>) => {
    setState((prev) => ({ ...prev, currentScreen: screen, ...options }));
  };

  if (showBanner) {
    return (
      <Box flexDirection="column" alignItems="center" justifyContent="center">
        <Text color="cyan">{Banner.getAsciiArt()}</Text>
        <Text color="gray">Loading TUI...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1}>
        {state.currentScreen === 'dashboard' && (
          <MainDashboard onNavigate={navigateToScreen} />
        )}
        {state.currentScreen === 'search' && (
          <SearchScreen
            onNavigate={navigateToScreen}
            initialQuery={state.searchQuery}
          />
        )}
        {state.currentScreen === 'docsets' && (
          <DocsetBrowser onNavigate={navigateToScreen} />
        )}
        {state.currentScreen === 'viewer' && (
          <DocumentViewer
            document={state.selectedDocument}
            onNavigate={navigateToScreen}
          />
        )}
        {state.currentScreen === 'settings' && (
          <SettingsScreen onNavigate={navigateToScreen} />
        )}
        {state.currentScreen === 'help' && (
          <HelpScreen onNavigate={navigateToScreen} />
        )}
      </Box>

      <StatusBar
        currentScreen={state.currentScreen}
        isLoading={state.isLoading}
      />
    </Box>
  );
}
