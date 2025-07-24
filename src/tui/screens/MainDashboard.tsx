import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';
import { ListDocs } from '../../core/ListDocs.js';
import { FileSystemAdapter } from '../../infrastructure/storage/FileSystemAdapter.js';

interface MainDashboardProps {
  onNavigate: (screen: Screen, options?: any) => void;
  setLoading: (loading: boolean) => void;
}

interface DashboardStats {
  totalDocsets: number;
  totalDocs: number;
  cacheSize: string;
  lastUpdated: string;
  status: 'ready' | 'empty' | 'error';
}

export function MainDashboard({ onNavigate, setLoading }: MainDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocsets: 0,
    totalDocs: 0,
    cacheSize: '0 MB',
    lastUpdated: 'Never',
    status: 'empty',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const lister = new ListDocs();
      const docsets = await lister.getAll();
      const storage = new FileSystemAdapter();

      let totalDocs = 0;
      let lastUpdated = 'Never';
      let latestDate: Date | null = null;

      for (const docset of docsets) {
        totalDocs += docset.metadata.totalDocs || 0;
        if (docset.metadata.lastFetched) {
          const fetchDate = new Date(docset.metadata.lastFetched);
          if (!latestDate || fetchDate > latestDate) {
            latestDate = fetchDate;
            lastUpdated = fetchDate.toLocaleDateString();
          }
        }
      }

      setStats({
        totalDocsets: docsets.length,
        totalDocs,
        cacheSize: '~' + Math.round(docsets.length * 2.5) + ' MB',
        lastUpdated: docsets.length > 0 ? lastUpdated : 'Never',
        status: docsets.length > 0 ? 'ready' : 'empty',
      });
    } catch (error) {
      setStats((prev) => ({ ...prev, status: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: '1',
      label: 'Search Documentation',
      screen: 'search' as Screen,
      icon: '🔍',
      desc: 'Full-text search across all docsets',
      available: stats.status === 'ready',
    },
    {
      key: '2',
      label: 'Manage Docsets',
      screen: 'docsets' as Screen,
      icon: '📚',
      desc: 'View and manage installed docs',
      available: true,
    },
    {
      key: '3',
      label: 'Browse Available',
      screen: 'available' as Screen,
      icon: '📦',
      desc: 'Install new documentation sets',
      available: true,
    },
    {
      key: '4',
      label: 'Settings',
      screen: 'settings' as Screen,
      icon: '⚙️',
      desc: 'Configure preferences & API keys',
      available: true,
    },
  ];

  useInput((input: string, key: any) => {
    if (key.return) {
      const selected = menuItems[selectedIndex];
      if (selected.available) {
        onNavigate(selected.screen);
      }
    }

    if ((key.upArrow || input === 'k') && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    if (
      (key.downArrow || input === 'j') &&
      selectedIndex < menuItems.length - 1
    ) {
      setSelectedIndex(selectedIndex + 1);
    }

    // Direct navigation shortcuts
    const num = parseInt(input);
    if (num >= 1 && num <= menuItems.length) {
      const selected = menuItems[num - 1];
      if (selected.available) {
        onNavigate(selected.screen);
      }
    }

    // Quick actions
    if (input === 'r') {
      loadStats();
    }
  });

  return (
    <Box flexDirection="row" height="100%" paddingX={1} paddingY={1} gap={1}>
      {/* Left Panel - Stats */}
      <Box width={32} flexDirection="column">
        <Box
          borderStyle="round"
          borderColor={
            stats.status === 'ready'
              ? 'green'
              : stats.status === 'error'
                ? 'red'
                : 'yellow'
          }
          paddingX={2}
          paddingY={1}
          marginBottom={1}
        >
          <Box flexDirection="column">
            <Text color="white" bold>
              📊 System Status
            </Text>
            <Box marginTop={1} flexDirection="column" gap={0}>
              <Box justifyContent="space-between">
                <Text color="gray">Docsets:</Text>
                <Text color={stats.totalDocsets > 0 ? 'green' : 'yellow'}>
                  {stats.totalDocsets}
                </Text>
              </Box>
              <Box justifyContent="space-between">
                <Text color="gray">Documents:</Text>
                <Text color={stats.totalDocs > 0 ? 'green' : 'gray'}>
                  {stats.totalDocs.toLocaleString()}
                </Text>
              </Box>
              <Box justifyContent="space-between">
                <Text color="gray">Cache:</Text>
                <Text color="cyan">{stats.cacheSize}</Text>
              </Box>
              <Box justifyContent="space-between">
                <Text color="gray">Updated:</Text>
                <Text color="gray">{stats.lastUpdated}</Text>
              </Box>
              <Box justifyContent="space-between" marginTop={1}>
                <Text color="gray">Status:</Text>
                <Text
                  color={
                    stats.status === 'ready'
                      ? 'green'
                      : stats.status === 'error'
                        ? 'red'
                        : 'yellow'
                  }
                >
                  {stats.status === 'ready'
                    ? '✓ Ready'
                    : stats.status === 'error'
                      ? '✗ Error'
                      : '⚠ Setup Required'}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
          <Box flexDirection="column">
            <Text color="cyan" bold>
              💡 Quick Tips
            </Text>
            <Box marginTop={1} flexDirection="column">
              <Text color="gray" dimColor>
                • Press numbers 1-4 for quick access
              </Text>
              <Text color="gray" dimColor>
                • Use ↑↓ or j/k to navigate
              </Text>
              <Text color="gray" dimColor>
                • Press r to refresh stats
              </Text>
              <Text color="gray" dimColor>
                • Press h for help anytime
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Actions */}
      <Box flexGrow={1} flexDirection="column">
        <Box
          borderStyle="round"
          borderColor="cyan"
          paddingX={3}
          paddingY={1}
          height="100%"
        >
          <Box flexDirection="column" width="100%">
            <Box marginBottom={1}>
              <Text color="cyan" bold>
                🚀 Available Actions
              </Text>
            </Box>

            {menuItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const isAvailable = item.available;

              return (
                <Box
                  key={item.key}
                  paddingX={2}
                  paddingY={1}
                  marginBottom={1}
                  borderStyle={isSelected ? 'round' : undefined}
                  borderColor={isSelected ? 'cyan' : undefined}
                  width="100%"
                >
                  <Box width="100%" flexDirection="column">
                    <Box>
                      <Text
                        color={
                          !isAvailable ? 'gray' : isSelected ? 'cyan' : 'white'
                        }
                        bold={isSelected}
                        dimColor={!isAvailable}
                      >
                        {isSelected ? '▶ ' : '  '}
                        {item.key}. {item.icon} {item.label}
                      </Text>
                      {!isAvailable && (
                        <Text color="yellow"> (requires setup)</Text>
                      )}
                    </Box>
                    <Box marginLeft={4} marginTop={0}>
                      <Text color="gray" dimColor>
                        {item.desc}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              );
            })}

            {stats.status === 'empty' && (
              <Box
                marginTop={2}
                paddingX={2}
                paddingY={1}
                borderStyle="round"
                borderColor="yellow"
              >
                <Box flexDirection="column">
                  <Text color="yellow" bold>
                    🎯 Getting Started
                  </Text>
                  <Box marginTop={1}>
                    <Text color="gray">
                      1. Press 3 to browse available docsets
                    </Text>
                  </Box>
                  <Text color="gray">
                    2. Install documentation for your tools
                  </Text>
                  <Text color="gray">
                    3. Start searching with full-text search
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
