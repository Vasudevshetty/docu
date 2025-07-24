import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';
import { FileSystemAdapter } from '../../infrastructure/storage/FileSystemAdapter.js';

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

      setStats({
        totalDocs: docsets.length * 100,
        availableDocsets: docsets.length,
        lastUpdated: docsets.length > 0 ? 'Recently' : 'Never',
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const menuItems = [
    {
      label: 'Search Documentation',
      value: 'search',
      icon: '🔍',
      desc: 'Find docs across all docsets',
    },
    {
      label: 'Browse Docsets',
      value: 'docsets',
      icon: '📚',
      desc: 'Manage installed documentation',
    },
    {
      label: 'Settings',
      value: 'settings',
      icon: '⚙️',
      desc: 'Configure docu-cli preferences',
    },
    {
      label: 'Help',
      value: 'help',
      icon: '❓',
      desc: 'View keyboard shortcuts and help',
    },
  ];

  useInput((input: string, key: any) => {
    if (key.return) {
      const selected = menuItems[selectedIndex];
      onNavigate(selected.value as Screen);
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

    // Number shortcuts
    const num = parseInt(input);
    if (num >= 1 && num <= menuItems.length) {
      const selected = menuItems[num - 1];
      onNavigate(selected.value as Screen);
    }
  });

  return (
    <Box flexDirection="column" height="100%" paddingX={2} paddingY={1}>
      {/* Clean Header */}
      <Box justifyContent="center" marginBottom={2}>
        <Text color="cyan" bold>
          docu-cli{' '}
        </Text>
        <Text color="gray">• Professional Documentation Browser</Text>
      </Box>

      {/* Main Content Area */}
      <Box flexDirection="row" flexGrow={1} gap={2}>
        {/* Left Sidebar - Stats */}
        <Box width={30} flexDirection="column">
          <Box
            borderStyle="round"
            borderColor="cyan"
            paddingX={2}
            paddingY={1}
            marginBottom={1}
          >
            <Text color="cyan" bold>
              📊 Overview
            </Text>
            <Box marginTop={1} flexDirection="column">
              <Box justifyContent="space-between" marginBottom={0}>
                <Text color="white">Documents</Text>
                <Text color="yellow">{stats.totalDocs}</Text>
              </Box>
              <Box justifyContent="space-between" marginBottom={0}>
                <Text color="white">Docsets</Text>
                <Text color="green">{stats.availableDocsets}</Text>
              </Box>
              <Box justifyContent="space-between">
                <Text color="white">Status</Text>
                <Text color={stats.availableDocsets > 0 ? 'green' : 'red'}>
                  {stats.availableDocsets > 0 ? 'Ready' : 'Setup Required'}
                </Text>
              </Box>
            </Box>
          </Box>

          <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
            <Text color="gray" bold>
              💡 Quick Tips
            </Text>
            <Box marginTop={1} flexDirection="column">
              <Text color="gray" dimColor>
                • Numbers 1-4: Quick nav
              </Text>
              <Text color="gray" dimColor>
                • ↑↓ or j/k: Navigate
              </Text>
              <Text color="gray" dimColor>
                • Enter: Select action
              </Text>
              <Text color="gray" dimColor>
                • h: Show help anytime
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Main Menu Area */}
        <Box flexGrow={1} flexDirection="column">
          <Box
            borderStyle="round"
            borderColor="white"
            paddingX={3}
            paddingY={2}
          >
            <Box marginBottom={1}>
              <Text color="white" bold>
                🚀 Available Actions
              </Text>
            </Box>

            {menuItems.map((item, index) => (
              <Box key={item.value} marginBottom={1}>
                <Box
                  paddingX={2}
                  paddingY={1}
                  borderStyle={index === selectedIndex ? 'round' : undefined}
                  borderColor={index === selectedIndex ? 'cyan' : undefined}
                  width="100%"
                >
                  <Box width="100%" justifyContent="space-between">
                    <Box>
                      <Text
                        color={index === selectedIndex ? 'cyan' : 'white'}
                        bold
                      >
                        {index === selectedIndex ? '▶ ' : '  '}
                        {index + 1}. {item.icon} {item.label}
                      </Text>
                    </Box>
                    <Box width={35}>
                      <Text color="gray" dimColor>
                        {item.desc}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Status Footer */}
      <Box
        justifyContent="center"
        marginTop={1}
        borderStyle="single"
        borderColor="gray"
        paddingY={0}
      >
        <Text color="gray">
          Navigation: ↑↓ j/k • Select: Enter • Shortcuts: 1-4 • Help: h • Quit:
          q
        </Text>
      </Box>
    </Box>
  );
}
