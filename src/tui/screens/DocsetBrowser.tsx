import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';
import { ListDocs } from '../../core/ListDocs.js';
import { Docset } from '../../domain/Docset.js';

interface DocsetBrowserProps {
  onNavigate: (screen: Screen, options?: any) => void;
}

export function DocsetBrowser({ onNavigate }: DocsetBrowserProps) {
  const [installedDocsets, setInstalledDocsets] = useState<Docset[]>([]);
  const [availableDocsets, setAvailableDocsets] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<'installed' | 'available'>(
    'installed'
  );
  const [loading, setLoading] = useState(true);

  const listDocs = new ListDocs();

  useEffect(() => {
    loadDocsets();
  }, []);

  const loadDocsets = async () => {
    setLoading(true);
    try {
      const [installed, available] = await Promise.all([
        listDocs.getAll(),
        listDocs.getAvailableDocsets(),
      ]);

      setInstalledDocsets(installed);
      setAvailableDocsets(available);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Failed to load docsets:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentList =
    currentTab === 'installed' ? installedDocsets : availableDocsets;
  const maxIndex = currentList.length - 1;

  useInput((input: string, key: any) => {
    if (key.escape) {
      onNavigate('dashboard');
      return;
    }

    // Tab switching
    if (key.tab || input === '1' || input === '2') {
      setCurrentTab(
        input === '2' || (key.tab && currentTab === 'installed')
          ? 'available'
          : 'installed'
      );
      setSelectedIndex(0);
      return;
    }

    // Navigation
    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    if (key.downArrow && selectedIndex < maxIndex) {
      setSelectedIndex(selectedIndex + 1);
    }

    // Actions
    if (key.return && currentList.length > 0) {
      if (currentTab === 'installed') {
        // Navigate to search within this docset
        const docset = installedDocsets[selectedIndex];
        onNavigate('search', { searchQuery: '', selectedDocset: docset.name });
      } else {
        // Show install prompt or navigate to fetch
        const docsetName = availableDocsets[selectedIndex];
        console.log(`To install: docu fetch ${docsetName}`);
      }
    }

    if (input === 'r') {
      loadDocsets();
    }
  });

  if (loading) {
    return (
      <Box paddingX={2} paddingY={1} justifyContent="center">
        <Text color="yellow">Loading docsets...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          📚 Docset Browser
        </Text>
      </Box>

      {/* Tabs */}
      <Box marginBottom={1} gap={2}>
        <Text
          color={currentTab === 'installed' ? 'cyan' : 'gray'}
          backgroundColor={currentTab === 'installed' ? 'blue' : undefined}
          bold={currentTab === 'installed'}
        >
          {currentTab === 'installed' ? '▶ ' : '  '}
          1. Installed ({installedDocsets.length})
        </Text>
        <Text
          color={currentTab === 'available' ? 'cyan' : 'gray'}
          backgroundColor={currentTab === 'available' ? 'blue' : undefined}
          bold={currentTab === 'available'}
        >
          {currentTab === 'available' ? '▶ ' : '  '}
          2. Available ({availableDocsets.length})
        </Text>
      </Box>

      {/* Content */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        flexGrow={1}
      >
        {currentTab === 'installed' ? (
          installedDocsets.length > 0 ? (
            <Box flexDirection="column">
              <Box marginBottom={1}>
                <Text color="white" bold>
                  📦 Installed Docsets
                </Text>
              </Box>
              {installedDocsets.map((docset, index) => (
                <Box
                  key={docset.name}
                  marginBottom={1}
                  paddingX={1}
                  borderStyle={index === selectedIndex ? 'single' : undefined}
                  borderColor={index === selectedIndex ? 'cyan' : undefined}
                >
                  <Box flexDirection="column" width="100%">
                    <Text
                      color={index === selectedIndex ? 'cyan' : 'white'}
                      bold={index === selectedIndex}
                    >
                      {index === selectedIndex ? '▶ ' : '  '}
                      {docset.name}
                    </Text>
                    <Text color="gray" dimColor>
                      Last updated:{' '}
                      {docset.metadata?.lastFetched?.toLocaleDateString() ||
                        'Unknown'}
                    </Text>
                    <Text color="gray" dimColor>
                      Documents: {docset.metadata?.totalDocs || 'Unknown'}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box justifyContent="center" alignItems="center" height={10}>
              <Box flexDirection="column" alignItems="center">
                <Text color="yellow">📭 No docsets installed</Text>
                <Text color="gray" dimColor>
                  Switch to Available tab to see what you can install
                </Text>
              </Box>
            </Box>
          )
        ) : availableDocsets.length > 0 ? (
          <Box flexDirection="column">
            <Box marginBottom={1}>
              <Text color="white" bold>
                🌐 Available Docsets
              </Text>
            </Box>
            {availableDocsets.map((docsetName, index) => (
              <Box
                key={docsetName}
                marginBottom={1}
                paddingX={1}
                borderStyle={index === selectedIndex ? 'single' : undefined}
                borderColor={index === selectedIndex ? 'cyan' : undefined}
              >
                <Text
                  color={index === selectedIndex ? 'cyan' : 'white'}
                  bold={index === selectedIndex}
                >
                  {index === selectedIndex ? '▶ ' : '  '}
                  {docsetName}
                </Text>
              </Box>
            ))}
          </Box>
        ) : (
          <Box justifyContent="center" alignItems="center" height={10}>
            <Text color="yellow">No available docsets found</Text>
          </Box>
        )}
      </Box>

      {/* Help */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          1/2: Switch tabs • ↑↓: Navigate • Enter: Select • R: Refresh • ESC:
          Back
        </Text>
      </Box>
    </Box>
  );
}
