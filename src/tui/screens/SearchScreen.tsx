import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { Screen } from '../App.js';
import { SearchDocs } from '../../core/SearchDocs.js';
import { SearchResult } from '../../domain/Search.js';
import { ListDocs } from '../../core/ListDocs.js';

interface SearchScreenProps {
  onNavigate: (screen: Screen, options?: any) => void;
  setLoading: (loading: boolean) => void;
  initialQuery?: string;
}

export function SearchScreen({
  onNavigate,
  setLoading,
  initialQuery = '',
}: SearchScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputFocused, setInputFocused] = useState(true);
  const [searchStats, setSearchStats] = useState({
    total: 0,
    docsets: 0,
    searchTime: 0,
  });
  const [availableDocsets, setAvailableDocsets] = useState<string[]>([]);
  const [selectedDocset, setSelectedDocset] = useState<string>('all');

  const searchDocs = new SearchDocs();

  useEffect(() => {
    loadDocsets();
    if (initialQuery) {
      setInputFocused(false);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const loadDocsets = async () => {
    try {
      const lister = new ListDocs();
      const docsets = await lister.getAll();
      setAvailableDocsets(['all', ...docsets.map((d) => d.name)]);
    } catch (error) {
      setAvailableDocsets(['all']);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchStats({ total: 0, docsets: 0, searchTime: 0 });
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const searchOptions = {
        limit: 20,
        docset: selectedDocset === 'all' ? undefined : selectedDocset,
      };

      const searchResults = await searchDocs.search(searchQuery, searchOptions);
      const searchTime = Date.now() - startTime;

      setResults(searchResults);
      setSelectedIndex(0);

      const uniqueDocsets = [...new Set(searchResults.map((r) => r.docset))];
      setSearchStats({
        total: searchResults.length,
        docsets: uniqueDocsets.length,
        searchTime,
      });
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setSearchStats({ total: 0, docsets: 0, searchTime: 0 });
    } finally {
      setLoading(false);
    }
  };

  useInput((input: string, key: any) => {
    if (inputFocused) {
      if (key.return) {
        performSearch(query);
        if (query.trim()) {
          setInputFocused(false);
        }
      }
      if (key.tab) {
        const currentIndex = availableDocsets.indexOf(selectedDocset);
        const nextIndex = (currentIndex + 1) % availableDocsets.length;
        setSelectedDocset(availableDocsets[nextIndex]);
      }
      return;
    }

    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    if (key.downArrow && selectedIndex < results.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }

    if (key.return && results[selectedIndex]) {
      onNavigate('viewer', { selectedDocument: results[selectedIndex] });
    }

    if (key.tab) {
      setInputFocused(true);
    }

    if (key.pageUp) {
      setSelectedIndex(Math.max(0, selectedIndex - 10));
    }

    if (key.pageDown) {
      setSelectedIndex(Math.min(results.length - 1, selectedIndex + 10));
    }
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <Box flexDirection="column" height="100%" paddingX={1} paddingY={1}>
      <Box
        borderStyle="round"
        borderColor={inputFocused ? 'cyan' : 'gray'}
        paddingX={2}
        paddingY={1}
        marginBottom={1}
      >
        <Box flexDirection="column" width="100%">
          <Box marginBottom={1}>
            <Text color="cyan" bold>
              🔍 Search Documentation
            </Text>
            <Text color="gray"> (TAB to change focus/filter)</Text>
          </Box>

          <Box>
            <Text color="gray">Query: </Text>
            <Box width="100%">
              <TextInput
                value={query}
                onChange={setQuery}
                placeholder="Enter search terms..."
                focus={inputFocused}
              />
            </Box>
          </Box>

          <Box marginTop={1} justifyContent="space-between">
            <Box>
              <Text color="gray">Filter: </Text>
              <Text color="yellow">{selectedDocset}</Text>
              <Text color="gray"> (TAB to cycle)</Text>
            </Box>
            {searchStats.total > 0 && (
              <Box>
                <Text color="green">{searchStats.total} results</Text>
                <Text color="gray">
                  {' '}
                  • {searchStats.docsets} docsets • {searchStats.searchTime}ms
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box flexGrow={1} flexDirection="column">
        {results.length > 0 ? (
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
                  📚 Search Results
                </Text>
                {!inputFocused && (
                  <Text color="cyan"> (↑↓ to navigate, Enter to view)</Text>
                )}
              </Box>

              <Box flexDirection="column" height="100%">
                {results.map((result, index) => {
                  const isSelected = index === selectedIndex && !inputFocused;

                  return (
                    <Box
                      key={`${result.docset}-${result.url}-${index}`}
                      paddingX={1}
                      paddingY={0}
                      marginBottom={1}
                      borderStyle={isSelected ? 'round' : undefined}
                      borderColor={isSelected ? 'cyan' : undefined}
                    >
                      <Box flexDirection="column" width="100%">
                        <Box>
                          <Text color={isSelected ? 'cyan' : 'white'} bold>
                            {isSelected ? '▶ ' : '  '}
                            {index + 1}. {truncateText(result.title, 60)}
                          </Text>
                        </Box>

                        <Box marginLeft={3}>
                          <Text color="gray">
                            🔗 {truncateText(result.url, 80)}
                          </Text>
                        </Box>

                        <Box marginLeft={3}>
                          <Text color="white">
                            {truncateText(
                              result.snippet?.replace(/\*\*/g, '') ||
                                'No preview available',
                              100
                            )}
                          </Text>
                        </Box>

                        <Box marginLeft={3} justifyContent="space-between">
                          <Box>
                            <Text color="magenta">📚 {result.docset}</Text>
                          </Box>
                          <Box>
                            <Text color="yellow">
                              ⭐ {result.score.toFixed(4)}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        ) : query.trim() && !inputFocused ? (
          <Box
            borderStyle="round"
            borderColor="yellow"
            paddingX={2}
            paddingY={1}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Box flexDirection="column" alignItems="center">
              <Text color="yellow" bold>
                🤷 No Results Found
              </Text>
              <Text color="gray">
                Try different search terms or check your docsets
              </Text>
              <Box marginTop={1}>
                <Text color="cyan">Press TAB to search again</Text>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            borderStyle="round"
            borderColor="gray"
            paddingX={2}
            paddingY={2}
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Box flexDirection="column" alignItems="center">
              <Text color="cyan" bold>
                🎯 Search Tips
              </Text>
              <Box marginTop={1} flexDirection="column" alignItems="center">
                <Text color="gray">• Enter keywords related to your query</Text>
                <Text color="gray">
                  • Use TAB to cycle through docset filters
                </Text>
                <Text color="gray">• Press Enter to search</Text>
                <Text color="gray">
                  • Exact phrases work better than single words
                </Text>
              </Box>
              <Box marginTop={1}>
                <Text color="yellow">
                  {availableDocsets.length > 1
                    ? `${availableDocsets.length - 1} docsets available for search`
                    : 'No docsets installed - press 3 to browse available'}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
