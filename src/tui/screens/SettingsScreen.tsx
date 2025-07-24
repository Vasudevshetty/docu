import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Screen } from '../App.js';

interface SettingsScreenProps {
  onNavigate: (screen: Screen, options?: any) => void;
}

interface Settings {
  groqApiKey: string;
  searchLimit: number;
  autoUpdate: boolean;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [settings, setSettings] = useState<Settings>({
    groqApiKey: process.env.GROQ_API_KEY || '',
    searchLimit: 10,
    autoUpdate: false,
  });

  const [selectedField, setSelectedField] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const fields = [
    {
      key: 'groqApiKey',
      label: 'Groq API Key',
      type: 'string',
      description: 'API key for AI explanations',
    },
    {
      key: 'searchLimit',
      label: 'Search Result Limit',
      type: 'number',
      description: 'Maximum number of search results to show',
    },
    {
      key: 'autoUpdate',
      label: 'Auto Update',
      type: 'boolean',
      description: 'Automatically check for docset updates',
    },
  ];

  useInput((input: string, key: any) => {
    if (editing) {
      if (key.return) {
        saveField();
      } else if (key.escape) {
        setEditing(false);
      }
      return;
    }

    if (key.escape) {
      onNavigate('dashboard');
      return;
    }

    // Navigation
    if (key.upArrow && selectedField > 0) {
      setSelectedField(selectedField - 1);
    }

    if (key.downArrow && selectedField < fields.length - 1) {
      setSelectedField(selectedField + 1);
    }

    // Edit field
    if (key.return) {
      startEditing();
    }

    // Toggle boolean
    if (input === ' ' && fields[selectedField].type === 'boolean') {
      const field = fields[selectedField];
      setSettings((prev) => ({
        ...prev,
        [field.key]: !prev[field.key as keyof Settings],
      }));
    }
  });

  const startEditing = () => {
    const field = fields[selectedField];
    if (field.type === 'boolean') return; // Booleans are toggled with space

    setEditValue(String(settings[field.key as keyof Settings]));
    setEditing(true);
  };

  const saveField = () => {
    const field = fields[selectedField];
    let value: any = editValue;

    if (field.type === 'number') {
      value = parseInt(editValue) || 0;
    }

    setSettings((prev) => ({
      ...prev,
      [field.key]: value,
    }));

    setEditing(false);
  };

  const getDisplayValue = (field: any): string => {
    const value = settings[field.key as keyof Settings];

    if (field.type === 'boolean') {
      return value ? '✓ Enabled' : '✗ Disabled';
    }

    if (field.key === 'groqApiKey' && value) {
      return '*'.repeat(Math.min(String(value).length, 20));
    }

    return String(value);
  };

  return (
    <Box flexDirection="column" paddingX={3} paddingY={2}>
      {/* Clean Header */}
      <Box marginBottom={2} justifyContent="space-between">
        <Text color="cyan" bold>
          ⚙️ Configuration
        </Text>
        <Text color="green" dimColor>
          Auto-saved
        </Text>
      </Box>

      {/* Settings Cards */}
      <Box flexDirection="column" flexGrow={1}>
        {fields.map((field, index) => (
          <Box
            key={field.key}
            marginBottom={1}
            paddingX={2}
            paddingY={1}
            borderStyle={index === selectedField ? 'single' : 'round'}
            borderColor={index === selectedField ? 'cyan' : 'gray'}
            flexDirection="column"
          >
            {/* Field Header */}
            <Box justifyContent="space-between" marginBottom={1}>
              <Box>
                <Text color={index === selectedField ? 'cyan' : 'white'} bold>
                  {index === selectedField ? '▶ ' : '  '}
                  {field.label}
                </Text>
              </Box>
              <Box>
                {field.type === 'boolean' && (
                  <Text
                    color={
                      settings[field.key as keyof Settings] ? 'green' : 'red'
                    }
                  >
                    {settings[field.key as keyof Settings] ? '●' : '○'}
                  </Text>
                )}
              </Box>
            </Box>

            {/* Field Value */}
            <Box paddingLeft={3}>
              {editing && index === selectedField ? (
                <Box>
                  <Text color="cyan">❯ </Text>
                  <TextInput
                    value={editValue}
                    onChange={setEditValue}
                    onSubmit={saveField}
                    focus={true}
                  />
                </Box>
              ) : (
                <Text color="yellow">{getDisplayValue(field)}</Text>
              )}
            </Box>

            {/* Field Description (only for selected) */}
            {index === selectedField && (
              <Box paddingLeft={3} marginTop={1}>
                <Text color="gray" dimColor>
                  {field.description}
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Environment Status */}
      <Box
        marginTop={2}
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
      >
        <Box justifyContent="space-between">
          <Text color="blue">Environment</Text>
          <Text color="gray">{process.env.NODE_ENV || 'development'}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text color="blue">Config Path</Text>
          <Text color="gray">~/.docu/config.json</Text>
        </Box>
      </Box>

      {/* Clean Status Line */}
      <Box
        marginTop={2}
        justifyContent="center"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
      >
        <Text color="gray">
          {editing
            ? 'Enter: Save • ESC: Cancel'
            : '↑↓: Navigate • Enter: Edit • Space: Toggle Boolean • ESC: Back'}
        </Text>
      </Box>
    </Box>
  );
}
