import { FileSystemAdapter } from '../infrastructure/storage/FileSystemAdapter.js';
import { Docset } from '../domain/Docset.js';

export class ListDocs {
  private readonly storage: FileSystemAdapter;

  constructor() {
    this.storage = new FileSystemAdapter();
  }

  async getAll(): Promise<Docset[]> {
    const docsetNames = await this.storage.listDocsets();
    const docsets: Docset[] = [];

    for (const name of docsetNames) {
      const metadata = await this.storage.loadMetadata(name);
      if (metadata) {
        docsets.push(new Docset(name, metadata));
      }
    }

    return docsets;
  }

  async getAvailableDocsets(): Promise<string[]> {
    // This would list all supported docsets from config
    const docsets = await import('../config/docsets.json', {
      with: { type: 'json' },
    });
    return docsets.default.map((d: any) => d.name);
  }
}
