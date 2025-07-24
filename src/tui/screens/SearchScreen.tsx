import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Screen } from '../App.js';
import { SearchDocs } from '../../core/SearchDocs.js';
import { SearchResult } from '../../domain/Search.js';

interface SearchScreenProps {
  onNavigate: (screen: Screen, options?: any) => void;
  initialQuery?: string;
}

export function SearchScreen({
  onNavigate,
  initialQuery = '',
}: SearchScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [inputFocused, setInputFocused] = useState(true);

  const searchDocs = new SearchDocs();

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchDocs.search(searchQuery, { limit: 20 });
      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useInput((input: string, key: any) => {
    if (inputFocused) {
      if (key.return) {
        performSearch(query);
        setInputFocused(false);
      }
      if (key.escape) {
        onNavigate('dashboard');
      }
      return;
    }

    // Navigation mode
    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    if (key.downArrow && selectedIndex < results.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }

    if (key.return && results[selectedIndex]) {
      onNavigate('viewer', { selectedDocument: results[selectedIndex] });
    }

    if (key.escape) {
      if (results.length > 0) {
        setInputFocused(true);
      } else {
        onNavigate('dashboard');
      }
    }

    // Focus input for new search
    if (input === '/') {
      setInputFocused(true);
      setQuery('');
    }
  });

  return (
    <Box flexDirection="column" paddingX={3} paddingY={2}>
      {/* Compact Header with Search Input */}
      <Box marginBottom={2} flexDirection="column">
        <Box justifyContent="space-between" marginBottom={1}>
          <Text color="cyan" bold>
            🔍 Search Documentation
          </Text>
          {isSearching && <Text color="yellow">⏳ Searching...</Text>}
          {!isSearching && results.length > 0 && (
            <Text color="green">{results.length} results</Text>
          )}
        </Box>

        <Box
          borderStyle="single"
          paddingX={2}
          paddingY={0}
          borderColor={inputFocused ? 'cyan' : 'gray'}
        >
          <Text color="cyan">❯ </Text>
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={performSearch}
            placeholder="Search documentation..."
            focus={inputFocused}
          />
        </Box>
      </Box>

      {/* Results Grid */}
      {results.length > 0 && (
        <Box flexDirection="column" flexGrow={1}>
          {results.slice(0, 12).map((result, index) => (
            <Box
              key={result.id}
              paddingX={2}
              paddingY={0}
              borderStyle={index === selectedIndex ? 'single' : undefined}
              borderColor={index === selectedIndex ? 'cyan' : undefined}
              marginBottom={index === selectedIndex ? 0 : 0}
            >
              <Box width="100%" justifyContent="space-between">
                <Box width="75%">
                  <Text
                    color={index === selectedIndex ? 'cyan' : 'white'}
                    bold={index === selectedIndex}
                  >
                    {index === selectedIndex ? '▶ ' : '  '}
                    {result.title}
                  </Text>
                </Box>
                <Box width="25%" justifyContent="flex-end">
                  <Text color="blue" dimColor>
                    {result.docset}
                  </Text>
                  <Text color="gray" dimColor>
                    {' '}
                    • {result.score.toFixed(2)}
                  </Text>
                </Box>
              </Box>
              {index === selectedIndex && result.snippet && (
                <Box marginTop={0} paddingLeft={3}>
                  <Text color="gray">
                    {result.snippet.length > 120
                      ? result.snippet.substring(0, 120) + '...'
                      : result.snippet}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!isSearching && query && results.length === 0 && (
        <Box justifyContent="center" marginY={4}>
          <Text color="yellow">🔍 No results found for "{query}"</Text>
        </Box>
      )}

      {/* Clean Status Line */}
      <Box
        marginTop={2}
        justifyContent="space-between"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
      >
        <Text color="gray">
          {inputFocused
            ? 'Type search • Enter: Search • ESC: Back'
            : '↑↓: Navigate • Enter: View • /: New Search • ESC: Back'}
        </Text>
        <Text color="gray">
          {results.length > 0 &&
            !inputFocused &&
            `${selectedIndex + 1}/${results.length}`}
        </Text>
      </Box>
    </Box>
  );
}
