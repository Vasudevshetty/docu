export interface DocContent {
  id: string;
  title: string;
  url: string;
  content: string;
  headings: string[];
  lastUpdated: Date;
}

export interface DocsetMetadata {
  name: string;
  version: string;
  description: string;
  baseUrl: string;
  lastFetched: Date;
  totalDocs: number;
}

export interface DocsetConfig {
  name: string;
  description: string;
  baseUrl: string;
  scrapeRules: {
    entryPoints: string[];
    selectors: {
      title: string;
      content: string;
      exclude: string;
    };
  };
}

export class Docset {
  constructor(
    public name: string,
    public metadata: DocsetMetadata,
    public docs: DocContent[] = []
  ) {}

  addDoc(doc: DocContent): void {
    this.docs.push(doc);
  }

  getTotalDocs(): number {
    return this.docs.length;
  }

  getDocById(id: string): DocContent | undefined {
    return this.docs.find((doc) => doc.id === id);
  }
}
