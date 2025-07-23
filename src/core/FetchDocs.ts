import {
  CheerioScraper,
  ScrapeRules,
} from '../infrastructure/scraper/CheerioScraper';
import { SQLiteIndexer } from '../infrastructure/indexer/SQLiteIndexer';
import { FileSystemAdapter } from '../infrastructure/storage/FileSystemAdapter';
import { DocsetMetadata, DocContent } from '../domain/Docset';
import docsets from '../config/docsets.json';

export class FetchDocs {
  private readonly scraper: CheerioScraper;
  private readonly indexer: SQLiteIndexer;
  private readonly storage: FileSystemAdapter;

  constructor() {
    this.scraper = new CheerioScraper();
    this.indexer = new SQLiteIndexer();
    this.storage = new FileSystemAdapter();
  }

  async run(docsetName: string, force = false): Promise<void> {
    const docsetConfig = this.getDocsetConfig(docsetName);

    if (!docsetConfig) {
      throw new Error(
        `Unknown docset: ${docsetName}. Available: ${this.getAvailableDocsets().join(', ')}`
      );
    }

    // Check if already exists and not forcing
    if (!force && (await this.storage.docsetExists(docsetName))) {
      throw new Error(
        `Docset ${docsetName} already exists. Use --force to re-fetch.`
      );
    }

    console.log(`Fetching ${docsetName} documentation...`);

    // Scrape documentation
    const docs = await this.scraper.scrapeDocset(
      docsetConfig.baseUrl,
      docsetConfig.scrapeRules
    );

    if (docs.length === 0) {
      throw new Error(`No documentation found for ${docsetName}`);
    }

    console.log(`Found ${docs.length} documents`);

    // Save metadata
    const metadata: DocsetMetadata = {
      name: docsetName,
      version: '1.0.0',
      description: docsetConfig.description,
      baseUrl: docsetConfig.baseUrl,
      lastFetched: new Date(),
      totalDocs: docs.length,
    };

    await this.storage.saveMetadata(docsetName, metadata);

    // Save individual documents
    for (const doc of docs) {
      await this.storage.saveDocContent(
        docsetName,
        doc.id,
        JSON.stringify(doc, null, 2)
      );
    }

    console.log(`Indexing ${docs.length} documents...`);

    // Index documents for search
    await this.indexer.indexDocuments(docsetName, docs);

    console.log(`Successfully fetched and indexed ${docsetName}`);
  }

  private getDocsetConfig(docsetName: string): any {
    return docsets.find((d) => d.name === docsetName);
  }

  private getAvailableDocsets(): string[] {
    return docsets.map((d) => d.name);
  }
}
