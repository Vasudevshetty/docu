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
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          🔍 Search Documentation
        </Text>
      </Box>

      {/* Search Input */}
      <Box
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        marginBottom={1}
        borderColor={inputFocused ? 'cyan' : 'gray'}
      >
        <Box>
          <Text color="white">Query: </Text>
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={performSearch}
            placeholder="Enter search terms..."
            focus={inputFocused}
          />
        </Box>
      </Box>

      {/* Loading */}
      {isSearching && (
        <Box marginBottom={1}>
          <Text color="yellow">Searching...</Text>
        </Box>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Box
          borderStyle="round"
          paddingX={2}
          paddingY={1}
          flexDirection="column"
          flexGrow={1}
        >
          <Box marginBottom={1}>
            <Text color="white" bold>
              📖 Results ({results.length})
            </Text>
          </Box>

          <Box flexDirection="column">
            {results.slice(0, 10).map((result, index) => (
              <Box
                key={result.id}
                marginBottom={1}
                paddingX={1}
                borderStyle={index === selectedIndex ? 'single' : undefined}
                borderColor={index === selectedIndex ? 'cyan' : undefined}
              >
                <Box flexDirection="column">
                  <Text
                    color={index === selectedIndex ? 'cyan' : 'white'}
                    bold={index === selectedIndex}
                  >
                    {index === selectedIndex ? '▶ ' : '  '}
                    {result.title}
                  </Text>
                  <Text color="gray" dimColor>
                    {result.docset} • Score: {result.score.toFixed(3)}
                  </Text>
                  {result.snippet && (
                    <Text color="gray">
                      {result.snippet.length > 100
                        ? result.snippet.substring(0, 100) + '...'
                        : result.snippet}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* No Results */}
      {!isSearching && query && results.length === 0 && (
        <Box
          borderStyle="round"
          paddingX={2}
          paddingY={1}
          justifyContent="center"
        >
          <Text color="yellow">No results found for "{query}"</Text>
        </Box>
      )}

      {/* Help */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          {inputFocused
            ? 'Type your search and press Enter • ESC: Back'
            : '↑↓: Navigate • Enter: View • /: New Search • ESC: Back to Search'}
        </Text>
      </Box>
    </Box>
  );
}
