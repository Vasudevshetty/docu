export interface Bookmark {
  id: string;
  title: string;
  content: string;
  docset: string;
  url: string;
  tags: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  importance: 'low' | 'medium' | 'high';
  snippet?: string;
  searchQuery?: string; // Original query that found this
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description: string;
  bookmarks: string[]; // Bookmark IDs
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface BookmarkSearchOptions {
  tags?: string[];
  category?: string;
  docset?: string;
  importance?: 'low' | 'medium' | 'high';
  limit?: number;
  query?: string;
  collection?: string;
}

export interface BookmarkStats {
  totalBookmarks: number;
  totalCollections: number;
  bookmarksByDocset: Record<string, number>;
  bookmarksByCategory: Record<string, number>;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentActivity: Bookmark[];
}
