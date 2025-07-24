import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Screen } from '../App.js';

interface HelpScreenProps {
  onNavigate: (screen: Screen, options?: any) => void;
}

export function HelpScreen({ onNavigate }: HelpScreenProps) {
  const [selectedSection, setSelectedSection] = useState(0);

  useInput((input: string, key: any) => {
    if (key.upArrow && selectedSection > 0) {
      setSelectedSection(selectedSection - 1);
    }

    if (key.downArrow && selectedSection < 3) {
      setSelectedSection(selectedSection + 1);
    }
  });

  const sections = [
    {
      title: '🎯 Global Shortcuts',
      color: 'cyan',
      items: [
        { key: '1', action: 'Search Documentation' },
        { key: '2', action: 'Manage Installed Docsets' },
        { key: '3', action: 'Browse Available Docsets' },
        { key: '4', action: 'Settings & Configuration' },
        { key: 'h / ?', action: 'Show this help screen' },
        { key: 'ESC / 0', action: 'Return to Dashboard' },
        { key: 'q', action: 'Quit (from Dashboard only)' },
        { key: 'Ctrl+C', action: 'Force exit application' },
      ],
    },
    {
      title: '🔍 Search Screen',
      color: 'green',
      items: [
        { key: 'Type query', action: 'Enter search terms' },
        { key: 'Enter', action: 'Execute search & switch to results' },
        { key: 'TAB', action: 'Switch between input/results or cycle filters' },
        { key: '↑↓', action: 'Navigate search results' },
        { key: 'Enter', action: 'View selected document' },
        { key: 'PgUp/PgDn', action: 'Jump 10 results up/down' },
        { key: 'ESC', action: 'Return to Dashboard' },
      ],
    },
    {
      title: '📚 Docset Browser',
      color: 'blue',
      items: [
        { key: 'TAB', action: 'Switch between Installed/Available modes' },
        { key: '↑↓', action: 'Navigate docset list' },
        {
          key: 'Enter',
          action: 'Search docset (installed) / Install (available)',
        },
        { key: 'i', action: 'Install selected docset (available mode)' },
        { key: 'd', action: 'Delete selected docset (installed mode)' },
        { key: 'r', action: 'Refresh docset lists' },
        { key: 'ESC', action: 'Return to Dashboard' },
      ],
    },
    {
      title: '📖 Document Viewer',
      color: 'yellow',
      items: [
        { key: '↑↓ / j/k', action: 'Scroll up/down line by line' },
        { key: 'PgUp/PgDn', action: 'Scroll page up/down' },
        { key: 'Home/End', action: 'Go to start/end of document' },
        { key: 'ESC', action: 'Return to search results' },
        { key: '/', action: 'Search within document (if available)' },
      ],
    },
  ];

  return (
    <Box flexDirection="column" height="100%" paddingX={1} paddingY={1}>
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
      >
        <Box flexDirection="column" width="100%">
          <Box justifyContent="center" marginBottom={1}>
            <Text color="cyan" bold>
              docu-cli v0.3.3 - Help & Documentation
            </Text>
          </Box>
          <Box justifyContent="center">
            <Text color="gray">
              AI-Powered Documentation Browser • Use ↑↓ to scroll sections
            </Text>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box flexGrow={1} flexDirection="row" gap={1}>
        {/* Left Column */}
        <Box width="50%" flexDirection="column">
          {sections.slice(0, 2).map((section, index) => (
            <Box
              key={index}
              borderStyle="round"
              borderColor={
                selectedSection === index ? (section.color as any) : 'gray'
              }
              paddingX={2}
              paddingY={1}
              marginBottom={1}
              height="50%"
            >
              <Box flexDirection="column" width="100%">
                <Box marginBottom={1}>
                  <Text color={section.color as any} bold>
                    {section.title}
                  </Text>
                </Box>
                <Box flexDirection="column">
                  {section.items.map((item, itemIndex) => (
                    <Box
                      key={itemIndex}
                      justifyContent="space-between"
                      marginBottom={0}
                    >
                      <Text color="yellow" bold>
                        {item.key.padEnd(12)}
                      </Text>
                      <Text color="white">{item.action}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Column */}
        <Box width="50%" flexDirection="column">
          {sections.slice(2, 4).map((section, index) => (
            <Box
              key={index + 2}
              borderStyle="round"
              borderColor={
                selectedSection === index + 2 ? (section.color as any) : 'gray'
              }
              paddingX={2}
              paddingY={1}
              marginBottom={1}
              height="50%"
            >
              <Box flexDirection="column" width="100%">
                <Box marginBottom={1}>
                  <Text color={section.color as any} bold>
                    {section.title}
                  </Text>
                </Box>
                <Box flexDirection="column">
                  {section.items.map((item, itemIndex) => (
                    <Box
                      key={itemIndex}
                      justifyContent="space-between"
                      marginBottom={0}
                    >
                      <Text color="yellow" bold>
                        {item.key.padEnd(12)}
                      </Text>
                      <Text color="white">{item.action}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
        <Box flexDirection="column" width="100%">
          <Box justifyContent="center" marginBottom={1}>
            <Text color="cyan" bold>
              💡 Pro Tips
            </Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexDirection="column">
              <Text color="gray">
                • Numbers 1-4 work globally for quick navigation
              </Text>
              <Text color="gray">
                • ESC always takes you back or to Dashboard
              </Text>
              <Text color="gray">
                • TAB cycles through modes and focus areas
              </Text>
            </Box>
            <Box flexDirection="column">
              <Text color="gray">
                • Search supports natural language queries
              </Text>
              <Text color="gray">
                • Install multiple docsets for comprehensive coverage
              </Text>
              <Text color="gray">
                • Use specific docset filters for targeted searches
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
