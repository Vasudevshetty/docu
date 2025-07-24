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
  | 'available'
  | 'viewer'
  | 'settings'
  | 'help';

interface AppState {
  currentScreen: Screen;
  selectedDocset?: string;
  searchQuery?: string;
  selectedDocument?: any;
  isLoading: boolean;
  context?: any;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'dashboard',
    isLoading: false,
  });

  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Hide banner after 1.5 seconds for faster startup
    const timer = setTimeout(() => setShowBanner(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useInput((input: string, key: any) => {
    // Global hotkeys - always available
    if (key.ctrl && input === 'c') {
      process.exit(0);
    }

    if (input === 'q' && state.currentScreen === 'dashboard') {
      process.exit(0);
    }

    if (key.escape || input === '0') {
      setState((prev: AppState) => ({
        ...prev,
        currentScreen: 'dashboard',
        context: undefined,
      }));
    }

    // Global navigation shortcuts
    switch (input) {
      case '1':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'search',
          context: undefined,
        }));
        break;
      case '2':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'docsets',
          context: undefined,
        }));
        break;
      case '3':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'available',
          context: undefined,
        }));
        break;
      case '4':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'settings',
          context: undefined,
        }));
        break;
      case '?':
      case 'h':
        setState((prev: AppState) => ({
          ...prev,
          currentScreen: 'help',
          context: undefined,
        }));
        break;
    }
  });

  const navigateToScreen = (screen: Screen, options?: Partial<AppState>) => {
    setState((prev) => ({ ...prev, currentScreen: screen, ...options }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  if (showBanner) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        minHeight={20}
      >
        <Box marginBottom={1} justifyContent="center">
          <Text color="cyan" bold>
            ╔══════════════════════════════════════╗
          </Text>
        </Box>
        <Box marginBottom={0} justifyContent="center">
          <Text color="cyan" bold>
            ║ docu-cli v0.3.3 ║
          </Text>
        </Box>
        <Box marginBottom={1} justifyContent="center">
          <Text color="cyan" bold>
            ╚══════════════════════════════════════╝
          </Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text color="white" dimColor>
            AI-Powered Documentation Browser
          </Text>
        </Box>
        <Box justifyContent="center">
          <Text color="yellow">⚡ </Text>
          <Text color="gray">Loading interface...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%" minHeight={24}>
      {/* Header */}
      <Box
        borderStyle="single"
        borderColor="cyan"
        paddingX={2}
        paddingY={0}
        marginBottom={0}
      >
        <Box justifyContent="space-between" width="100%">
          <Box>
            <Text color="cyan" bold>
              docu-cli
            </Text>
            <Text color="gray"> › </Text>
            <Text color="white">
              {state.currentScreen.charAt(0).toUpperCase() +
                state.currentScreen.slice(1)}
            </Text>
            {state.isLoading && (
              <>
                <Text color="gray"> › </Text>
                <Text color="yellow">⟳ Loading...</Text>
              </>
            )}
          </Box>
          <Box>
            <Text color="gray" dimColor>
              ESC:Home • h:Help • q:Quit
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Main content area */}
      <Box flexGrow={1} height="100%">
        {state.currentScreen === 'dashboard' && (
          <MainDashboard
            onNavigate={navigateToScreen}
            setLoading={setLoading}
          />
        )}
        {state.currentScreen === 'search' && (
          <SearchScreen
            onNavigate={navigateToScreen}
            setLoading={setLoading}
            initialQuery={state.searchQuery}
          />
        )}
        {state.currentScreen === 'docsets' && (
          <DocsetBrowser
            onNavigate={navigateToScreen}
            setLoading={setLoading}
          />
        )}
        {state.currentScreen === 'available' && (
          <DocsetBrowser
            onNavigate={navigateToScreen}
            setLoading={setLoading}
            mode="available"
          />
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

      {/* Status bar at bottom */}
      <StatusBar
        currentScreen={state.currentScreen}
        isLoading={state.isLoading}
      />
    </Box>
  );
}
