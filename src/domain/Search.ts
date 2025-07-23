export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  docset: string;
}

export interface SearchOptions {
  limit?: number;
  docset?: string;
  minScore?: number;
}
