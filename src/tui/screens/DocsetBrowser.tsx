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
    <Box flexDirection="column" paddingX={3} paddingY={2}>
      {/* Clean Header with Tab Navigation */}
      <Box marginBottom={2} justifyContent="space-between">
        <Text color="cyan" bold>
          📚 Docset Manager
        </Text>
        <Box gap={1}>
          <Text
            color={currentTab === 'installed' ? 'cyan' : 'gray'}
            bold={currentTab === 'installed'}
          >
            [1] Installed ({installedDocsets.length})
          </Text>
          <Text color="gray">|</Text>
          <Text
            color={currentTab === 'available' ? 'cyan' : 'gray'}
            bold={currentTab === 'available'}
          >
            [2] Available ({availableDocsets.length})
          </Text>
        </Box>
      </Box>

      {/* Content Area */}
      <Box flexDirection="column" flexGrow={1}>
        {currentTab === 'installed' ? (
          installedDocsets.length > 0 ? (
            installedDocsets.map((docset, index) => (
              <Box
                key={docset.name}
                marginBottom={1}
                paddingX={2}
                paddingY={1}
                borderStyle={index === selectedIndex ? 'single' : 'round'}
                borderColor={index === selectedIndex ? 'cyan' : 'gray'}
                flexDirection="column"
              >
                {/* Docset Header */}
                <Box justifyContent="space-between">
                  <Text color={index === selectedIndex ? 'cyan' : 'white'} bold>
                    {index === selectedIndex ? '▶ ' : '  '}
                    {docset.name}
                  </Text>
                  <Text color="green">✓ Installed</Text>
                </Box>

                {/* Docset Stats (only for selected) */}
                {index === selectedIndex && (
                  <Box marginTop={1} justifyContent="space-between">
                    <Text color="gray">
                      📄 {docset.metadata?.totalDocs || 'Unknown'} docs
                    </Text>
                    <Text color="gray">
                      🕒{' '}
                      {docset.metadata?.lastFetched?.toLocaleDateString() ||
                        'Unknown'}
                    </Text>
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Box justifyContent="center" marginY={6}>
              <Box flexDirection="column" alignItems="center">
                <Text color="yellow">📭 No docsets installed</Text>
                <Text color="gray" dimColor>
                  Press [2] to browse available docsets
                </Text>
              </Box>
            </Box>
          )
        ) : availableDocsets.length > 0 ? (
          <Box flexDirection="column">
            {availableDocsets.map((docsetName, index) => (
              <Box
                key={docsetName}
                paddingX={2}
                paddingY={0}
                borderStyle={index === selectedIndex ? 'single' : undefined}
                borderColor={index === selectedIndex ? 'cyan' : undefined}
                justifyContent="space-between"
                marginBottom={index === selectedIndex ? 0 : 0}
              >
                <Text
                  color={index === selectedIndex ? 'cyan' : 'white'}
                  bold={index === selectedIndex}
                >
                  {index === selectedIndex ? '▶ ' : '  '}
                  {docsetName}
                </Text>
                <Text color="blue" dimColor>
                  Download
                </Text>
              </Box>
            ))}
          </Box>
        ) : (
          <Box justifyContent="center" marginY={6}>
            <Text color="yellow">🌐 No available docsets found</Text>
          </Box>
        )}
      </Box>

      {/* Action Hint for Available Docsets */}
      {currentTab === 'available' && availableDocsets.length > 0 && (
        <Box
          marginTop={2}
          justifyContent="center"
          borderStyle="single"
          borderColor="blue"
          paddingX={2}
        >
          <Text color="blue">
            💡 To install: Run `docu fetch{' '}
            {availableDocsets[selectedIndex] || 'docset-name'}` in terminal
          </Text>
        </Box>
      )}

      {/* Clean Status Line */}
      <Box
        marginTop={2}
        justifyContent="center"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
      >
        <Text color="gray">
          1/2: Switch Tabs • ↑↓: Navigate • Enter:{' '}
          {currentTab === 'installed' ? 'Search' : 'Show Install'} • R: Refresh
          • ESC: Back
        </Text>
      </Box>
    </Box>
  );
}
