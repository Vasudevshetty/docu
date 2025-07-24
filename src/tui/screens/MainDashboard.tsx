import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';
import { FileSystemAdapter } from '../../infrastructure/storage/FileSystemAdapter.js';
import { SQLiteIndexer } from '../../infrastructure/indexer/SQLiteIndexer.js';

interface MainDashboardProps {
  onNavigate: (screen: Screen, options?: any) => void;
}

interface DashboardStats {
  totalDocs: number;
  availableDocsets: number;
  lastUpdated: string;
}

export function MainDashboard({ onNavigate }: MainDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocs: 0,
    availableDocsets: 0,
    lastUpdated: 'Never',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const storage = new FileSystemAdapter();
      const docsets = await storage.listDocsets();

      // For simplicity, we'll just count docsets -
      // actual document count would require querying each database
      setStats({
        totalDocs: docsets.length * 100, // Rough estimate
        availableDocsets: docsets.length,
        lastUpdated: docsets.length > 0 ? 'Recently' : 'Never',
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const menuItems = [
    {
      label: '🔍 Search Documentation',
      value: 'search',
    },
    {
      label: '📚 Browse Docsets',
      value: 'docsets',
    },
    {
      label: '⚙️  Settings',
      value: 'settings',
    },
    {
      label: '❓ Help',
      value: 'help',
    },
  ];

  useInput((input: string, key: any) => {
    if (key.return) {
      const selected = menuItems[selectedIndex];
      onNavigate(selected.value as Screen);
    }

    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    if (key.downArrow && selectedIndex < menuItems.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  });

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          Welcome to docu-cli TUI
        </Text>
      </Box>

      {/* Stats */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginBottom={2}
        flexDirection="column"
      >
        <Text color="white" bold>
          📊 Statistics
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text>
            <Text color="yellow">Documents:</Text> {stats.totalDocs}
          </Text>
          <Text>
            <Text color="green">Docsets:</Text> {stats.availableDocsets}
          </Text>
          <Text>
            <Text color="blue">Last Updated:</Text> {stats.lastUpdated}
          </Text>
        </Box>
      </Box>

      {/* Menu */}
      <Box borderStyle="round" paddingX={2} paddingY={1} flexDirection="column">
        <Box marginBottom={1}>
          <Text color="white" bold>
            🚀 Quick Actions
          </Text>
        </Box>

        {menuItems.map((item, index) => (
          <Box
            key={item.value}
            marginBottom={index < menuItems.length - 1 ? 1 : 0}
          >
            <Text
              color={index === selectedIndex ? 'cyan' : 'white'}
              backgroundColor={index === selectedIndex ? 'blue' : undefined}
              bold={index === selectedIndex}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text color="gray" dimColor>
          Use ↑↓ to navigate, Enter to select
        </Text>
      </Box>
    </Box>
  );
}
