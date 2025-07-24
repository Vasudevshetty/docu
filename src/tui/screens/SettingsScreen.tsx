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
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ⚙️ Settings
        </Text>
      </Box>

      {/* Settings form */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        flexGrow={1}
      >
        <Box marginBottom={1}>
          <Text color="white" bold>
            🔧 Configuration
          </Text>
        </Box>

        {fields.map((field, index) => (
          <Box
            key={field.key}
            marginBottom={2}
            paddingX={1}
            borderStyle={index === selectedField ? 'single' : undefined}
            borderColor={index === selectedField ? 'cyan' : undefined}
            flexDirection="column"
          >
            <Box marginBottom={1}>
              <Text
                color={index === selectedField ? 'cyan' : 'white'}
                bold={index === selectedField}
              >
                {index === selectedField ? '▶ ' : '  '}
                {field.label}
              </Text>
            </Box>

            <Box marginBottom={1} paddingLeft={2}>
              <Text color="gray" dimColor>
                {field.description}
              </Text>
            </Box>

            <Box paddingLeft={2}>
              {editing && index === selectedField ? (
                <Box>
                  <Text color="white">Value: </Text>
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
          </Box>
        ))}
      </Box>

      {/* Actions */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginTop={1}
        flexDirection="column"
      >
        <Box marginBottom={1}>
          <Text color="white" bold>
            💾 Actions
          </Text>
        </Box>

        <Text color="green">✓ Settings are automatically saved</Text>

        <Text color="gray" dimColor>
          Note: Some settings may require restart to take effect
        </Text>
      </Box>

      {/* Help */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          {editing
            ? 'Enter: Save • ESC: Cancel'
            : '↑↓: Navigate • Enter: Edit • Space: Toggle • ESC: Back'}
        </Text>
      </Box>
    </Box>
  );
}
