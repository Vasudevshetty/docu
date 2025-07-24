import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';
import { ListDocs } from '../../core/ListDocs.js';
import { FetchDocs } from '../../core/FetchDocs.js';
import { RemoveDocs } from '../../core/RemoveDocs.js';
import { Docset } from '../../domain/Docset.js';
import docsets from '../../config/docsets.json' with { type: 'json' };

interface DocsetBrowserProps {
  onNavigate: (screen: Screen, options?: any) => void;
  setLoading: (loading: boolean) => void;
  mode?: 'installed' | 'available';
}

interface AvailableDocset {
  name: string;
  description: string;
  baseUrl: string;
  isInstalled: boolean;
}

export function DocsetBrowser({
  onNavigate,
  setLoading,
  mode = 'installed',
}: DocsetBrowserProps) {
  const [installedDocsets, setInstalledDocsets] = useState<Docset[]>([]);
  const [availableDocsets, setAvailableDocsets] = useState<AvailableDocset[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<'installed' | 'available'>(
    mode
  );
  const [actionMode, setActionMode] = useState(false);

  const listDocs = new ListDocs();
  const fetchDocs = new FetchDocs();
  const removeDocs = new RemoveDocs();

  useEffect(() => {
    loadDocsets();
  }, []);

  const loadDocsets = async () => {
    setLoading(true);
    try {
      const installed = await listDocs.getAll();
      const installedNames = new Set(installed.map((d) => d.name));

      const available = docsets.map((docset) => ({
        name: docset.name,
        description: docset.description,
        baseUrl: docset.baseUrl,
        isInstalled: installedNames.has(docset.name),
      }));

      setInstalledDocsets(installed);
      setAvailableDocsets(available);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Failed to load docsets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (docsetName: string) => {
    setLoading(true);
    try {
      await fetchDocs.run(docsetName);
      await loadDocsets(); // Refresh the lists
    } catch (error) {
      console.error('Failed to install docset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (docsetName: string) => {
    setLoading(true);
    try {
      await removeDocs.remove(docsetName);
      await loadDocsets(); // Refresh the lists
    } catch (error) {
      console.error('Failed to remove docset:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentList =
    currentMode === 'installed' ? installedDocsets : availableDocsets;
  const maxIndex = currentList.length - 1;

  useInput((input: string, key: any) => {
    // Tab switching between modes
    if (key.tab) {
      setCurrentMode(currentMode === 'installed' ? 'available' : 'installed');
      setSelectedIndex(0);
      setActionMode(false);
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
      if (currentMode === 'installed') {
        const docset = installedDocsets[selectedIndex];
        onNavigate('search', { searchQuery: '', selectedDocset: docset.name });
      } else {
        const docset = availableDocsets[selectedIndex];
        if (!docset.isInstalled) {
          handleInstall(docset.name);
        }
      }
    }

    // Install/Remove actions
    if (
      input === 'i' &&
      currentMode === 'available' &&
      currentList.length > 0
    ) {
      const docset = availableDocsets[selectedIndex];
      if (!docset.isInstalled) {
        handleInstall(docset.name);
      }
    }

    if (
      input === 'd' &&
      currentMode === 'installed' &&
      currentList.length > 0
    ) {
      const docset = installedDocsets[selectedIndex];
      handleRemove(docset.name);
    }

    // Refresh
    if (input === 'r') {
      loadDocsets();
    }
  });

  const formatSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box flexDirection="column" height="100%" paddingX={1} paddingY={1}>
      {/* Header with tabs */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
      >
        <Box flexDirection="column" width="100%">
          <Box marginBottom={1}>
            <Text color="cyan" bold>
              📚 Docset Manager
            </Text>
            <Text color="gray"> (TAB to switch modes)</Text>
          </Box>

          <Box justifyContent="space-between">
            <Box>
              <Box
                paddingX={2}
                paddingY={0}
                borderStyle={currentMode === 'installed' ? 'round' : undefined}
                borderColor={currentMode === 'installed' ? 'cyan' : undefined}
              >
                <Text
                  color={currentMode === 'installed' ? 'cyan' : 'gray'}
                  bold
                >
                  📦 Installed ({installedDocsets.length})
                </Text>
              </Box>
              <Text color="gray"> | </Text>
              <Box
                paddingX={2}
                paddingY={0}
                borderStyle={currentMode === 'available' ? 'round' : undefined}
                borderColor={currentMode === 'available' ? 'cyan' : undefined}
              >
                <Text
                  color={currentMode === 'available' ? 'cyan' : 'gray'}
                  bold
                >
                  🌐 Available (
                  {availableDocsets.filter((d) => !d.isInstalled).length})
                </Text>
              </Box>
            </Box>

            <Box>
              {currentMode === 'installed' ? (
                <Text color="gray">Enter:Search • d:Delete • r:Refresh</Text>
              ) : (
                <Text color="gray">Enter:Install • i:Install • r:Refresh</Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content area */}
      <Box flexGrow={1} flexDirection="column">
        {currentList.length > 0 ? (
          <Box
            borderStyle="round"
            borderColor="white"
            paddingX={1}
            paddingY={1}
            height="100%"
          >
            <Box flexDirection="column" width="100%">
              <Box marginBottom={1}>
                <Text color="white" bold>
                  {currentMode === 'installed'
                    ? '📦 Installed Documentation'
                    : '🌐 Available for Installation'}
                </Text>
              </Box>

              <Box flexDirection="column" height="100%">
                {currentMode === 'installed'
                  ? installedDocsets.map((docset, index) => {
                      const isSelected = index === selectedIndex;

                      return (
                        <Box
                          key={docset.name}
                          paddingX={1}
                          paddingY={1}
                          marginBottom={1}
                          borderStyle={isSelected ? 'round' : undefined}
                          borderColor={isSelected ? 'cyan' : undefined}
                        >
                          <Box flexDirection="column" width="100%">
                            <Box justifyContent="space-between">
                              <Text color={isSelected ? 'cyan' : 'white'} bold>
                                {isSelected ? '▶ ' : '  '}
                                {docset.name}
                              </Text>
                              <Text color="green">✓ Installed</Text>
                            </Box>

                            <Box marginLeft={3} justifyContent="space-between">
                              <Text color="gray">
                                {docset.metadata.description}
                              </Text>
                            </Box>

                            <Box marginLeft={3} justifyContent="space-between">
                              <Box>
                                <Text color="yellow">
                                  📊 {docset.metadata.totalDocs || 0} docs
                                </Text>
                                <Text color="gray"> • </Text>
                                <Text color="cyan">
                                  🕒{' '}
                                  {formatDate(
                                    docset.metadata.lastFetched?.toString() ||
                                      new Date().toISOString()
                                  )}
                                </Text>
                              </Box>
                              <Box>
                                <Text color="magenta">
                                  v{docset.metadata.version || '1.0'}
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })
                  : availableDocsets.map((docset, index) => {
                      const isSelected = index === selectedIndex;

                      return (
                        <Box
                          key={docset.name}
                          paddingX={1}
                          paddingY={1}
                          marginBottom={1}
                          borderStyle={isSelected ? 'round' : undefined}
                          borderColor={isSelected ? 'cyan' : undefined}
                        >
                          <Box flexDirection="column" width="100%">
                            <Box justifyContent="space-between">
                              <Text color={isSelected ? 'cyan' : 'white'} bold>
                                {isSelected ? '▶ ' : '  '}
                                {docset.name}
                              </Text>
                              <Text
                                color={docset.isInstalled ? 'green' : 'yellow'}
                              >
                                {docset.isInstalled
                                  ? '✓ Installed'
                                  : '⬇ Available'}
                              </Text>
                            </Box>

                            <Box marginLeft={3}>
                              <Text color="gray">{docset.description}</Text>
                            </Box>

                            <Box marginLeft={3} justifyContent="space-between">
                              <Text color="blue">🔗 {docset.baseUrl}</Text>
                              {!docset.isInstalled && (
                                <Text color="cyan">
                                  Press Enter or i to install
                                </Text>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            borderStyle="round"
            borderColor="yellow"
            paddingX={2}
            paddingY={2}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Box flexDirection="column" alignItems="center">
              <Text color="yellow" bold>
                {currentMode === 'installed'
                  ? '📦 No Docsets Installed'
                  : '🌐 No Available Docsets'}
              </Text>
              <Box marginTop={1} flexDirection="column" alignItems="center">
                {currentMode === 'installed' ? (
                  <>
                    <Text color="gray">
                      Switch to Available tab to install documentation
                    </Text>
                    <Text color="cyan">
                      Press TAB to switch to Available mode
                    </Text>
                  </>
                ) : (
                  <>
                    <Text color="gray">
                      No docsets available for installation
                    </Text>
                    <Text color="cyan">
                      Check your configuration or internet connection
                    </Text>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
