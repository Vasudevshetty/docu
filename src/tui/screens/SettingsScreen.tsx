import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Screen } from '../App.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface SettingsScreenProps {
  onNavigate: (screen: Screen, options?: any) => void;
}

interface Settings {
  groqApiKey: string;
  searchLimit: number;
  cacheDirectory: string;
  theme: 'dark' | 'light';
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [settings, setSettings] = useState<Settings>({
    groqApiKey: process.env.GROQ_API_KEY || '',
    searchLimit: 20,
    cacheDirectory: path.join(os.homedir(), '.docu'),
    theme: 'dark',
  });

  const [selectedField, setSelectedField] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);

  const fields = [
    {
      key: 'groqApiKey',
      label: 'Groq API Key',
      type: 'string',
      description: 'API key for AI-powered explanations (optional)',
      placeholder: 'gsk_...',
    },
    {
      key: 'searchLimit',
      label: 'Search Limit',
      type: 'number',
      description: 'Maximum search results per query (5-50)',
      placeholder: '20',
    },
    {
      key: 'cacheDirectory',
      label: 'Cache Directory',
      type: 'string',
      description: 'Where documentation is stored locally',
      placeholder: path.join(os.homedir(), '.docu'),
    },
    {
      key: 'theme',
      label: 'UI Theme',
      type: 'select',
      description: 'Color scheme for the interface',
      options: ['dark', 'light'],
    },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const configPath = path.join(os.homedir(), '.docu', 'config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        setSettings((prev) => ({ ...prev, ...config }));
      }
    } catch (error) {
      // Use defaults if config doesn't exist
    }
  };

  const saveSettings = async () => {
    try {
      const configDir = path.join(os.homedir(), '.docu');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      const configPath = path.join(configDir, 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  useInput((input: string, key: any) => {
    if (editing) {
      if (key.return) {
        const field = fields[selectedField];
        let newValue: any = editValue;

        if (field.type === 'number') {
          newValue = parseInt(editValue) || settings.searchLimit;
        }

        setSettings((prev) => ({ ...prev, [field.key]: newValue }));
        setEditing(false);
        setEditValue('');
      }
      if (key.escape) {
        setEditing(false);
        setEditValue('');
      }
      return;
    }

    // Navigation
    if (key.upArrow && selectedField > 0) {
      setSelectedField(selectedField - 1);
    }

    if (key.downArrow && selectedField < fields.length - 1) {
      setSelectedField(selectedField + 1);
    }

    // Actions
    if (key.return) {
      const field = fields[selectedField];
      if (field.type === 'select') {
        // Toggle through options
        const currentIndex = field.options!.indexOf(
          settings[field.key as keyof Settings] as string
        );
        const nextIndex = (currentIndex + 1) % field.options!.length;
        setSettings((prev) => ({
          ...prev,
          [field.key]: field.options![nextIndex],
        }));
      } else {
        setEditValue(String(settings[field.key as keyof Settings]));
        setEditing(true);
      }
    }

    // Save settings
    if (input === 's' && !editing) {
      saveSettings();
    }

    // Reset to defaults
    if (input === 'r' && !editing) {
      setSettings({
        groqApiKey: '',
        searchLimit: 20,
        cacheDirectory: path.join(os.homedir(), '.docu'),
        theme: 'dark',
      });
    }
  });

  const formatValue = (field: any, value: any) => {
    if (field.key === 'groqApiKey' && value) {
      return '***' + value.slice(-4);
    }
    return String(value);
  };

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
          <Box justifyContent="space-between" marginBottom={1}>
            <Text color="cyan" bold>
              ⚙️ Settings & Configuration
            </Text>
            {saved && <Text color="green">✓ Settings saved!</Text>}
          </Box>
          <Box justifyContent="space-between">
            <Text color="gray">
              Configure docu-cli v0.3.4 preferences and API keys
            </Text>
            <Text color="gray">s:Save • r:Reset • Enter:Edit</Text>
          </Box>
        </Box>
      </Box>

      {/* Settings List */}
      <Box flexGrow={1} flexDirection="column">
        <Box
          borderStyle="round"
          borderColor="white"
          paddingX={2}
          paddingY={1}
          height="100%"
        >
          <Box flexDirection="column" width="100%">
            <Box marginBottom={1}>
              <Text color="white" bold>
                ⚙️ Configuration Options
              </Text>
            </Box>

            <Box flexDirection="column" gap={1}>
              {fields.map((field, index) => {
                const isSelected = index === selectedField;
                const isEditing = editing && index === selectedField;

                return (
                  <Box
                    key={field.key}
                    paddingX={2}
                    paddingY={1}
                    borderStyle={isSelected ? 'round' : undefined}
                    borderColor={isSelected ? 'cyan' : undefined}
                  >
                    <Box flexDirection="column" width="100%">
                      <Box justifyContent="space-between">
                        <Text color={isSelected ? 'cyan' : 'white'} bold>
                          {isSelected ? '▶ ' : '  '}
                          {field.label}
                        </Text>
                        <Box>
                          {field.type === 'select' && (
                            <Text color="yellow">
                              {field.options!.join(' | ')}
                            </Text>
                          )}
                        </Box>
                      </Box>

                      <Box marginLeft={3} justifyContent="space-between">
                        <Text color="gray">{field.description}</Text>
                      </Box>

                      <Box marginLeft={3} marginTop={1}>
                        <Text color="gray">Value: </Text>
                        {isEditing ? (
                          <TextInput
                            value={editValue}
                            onChange={setEditValue}
                            placeholder={field.placeholder}
                            focus={true}
                          />
                        ) : (
                          <Text color="green">
                            {formatValue(
                              field,
                              settings[field.key as keyof Settings]
                            ) ||
                              field.placeholder ||
                              'Not set'}
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
      </Box>

      {/* Footer Help */}
      <Box borderStyle="round" borderColor="gray" paddingX={2} paddingY={1}>
        <Box flexDirection="column" width="100%">
          <Box justifyContent="center" marginBottom={1}>
            <Text color="cyan" bold>
              💡 Settings Help
            </Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexDirection="column">
              <Text color="gray">• ↑↓: Navigate settings</Text>
              <Text color="gray">• Enter: Edit value or toggle option</Text>
              <Text color="gray">• s: Save all settings to config file</Text>
            </Box>
            <Box flexDirection="column">
              <Text color="gray">• r: Reset to default values</Text>
              <Text color="gray">
                • ESC: Cancel editing or return to dashboard
              </Text>
              <Text color="gray">
                • Settings are saved to ~/.docu/config.json
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
