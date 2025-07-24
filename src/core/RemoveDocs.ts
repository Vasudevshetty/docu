import { FileSystemAdapter } from '../infrastructure/storage/FileSystemAdapter.js';
import { SQLiteIndexer } from '../infrastructure/indexer/SQLiteIndexer.js';

export class RemoveDocs {
  private readonly storage: FileSystemAdapter;
  private readonly indexer: SQLiteIndexer;

  constructor() {
    this.storage = new FileSystemAdapter();
    this.indexer = new SQLiteIndexer();
  }

  async remove(docsetName: string): Promise<void> {
    const exists = await this.storage.docsetExists(docsetName);

    if (!exists) {
      throw new Error(`Docset ${docsetName} is not installed`);
    }

    // Remove the docset directory
    await this.storage.removeDocset(docsetName);

    // Remove the search index
    await this.indexer.removeIndex(docsetName);

    console.log(`Successfully removed ${docsetName}`);
  }
}
