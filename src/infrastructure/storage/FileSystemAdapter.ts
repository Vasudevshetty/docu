import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { DocsetMetadata, Docset } from '../../domain/Docset.js';

export class FileSystemAdapter {
  private readonly docuDir: string;

  constructor() {
    this.docuDir = path.join(os.homedir(), '.docu');
  }

  async ensureDocuDir(): Promise<void> {
    await fs.mkdir(this.docuDir, { recursive: true });
  }

  async ensureDocsetDir(docsetName: string): Promise<string> {
    const docsetDir = path.join(this.docuDir, docsetName);
    await fs.mkdir(docsetDir, { recursive: true });
    return docsetDir;
  }

  async ensureIndexDir(): Promise<string> {
    const indexDir = path.join(this.docuDir, 'index');
    await fs.mkdir(indexDir, { recursive: true });
    return indexDir;
  }

  async saveMetadata(
    docsetName: string,
    metadata: DocsetMetadata
  ): Promise<void> {
    const docsetDir = await this.ensureDocsetDir(docsetName);
    const metadataPath = path.join(docsetDir, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  async loadMetadata(docsetName: string): Promise<DocsetMetadata | null> {
    const docsetDir = path.join(this.docuDir, docsetName);
    const metadataPath = path.join(docsetDir, 'metadata.json');

    try {
      const data = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(data);
      // Convert date strings back to Date objects
      metadata.lastFetched = new Date(metadata.lastFetched);
      return metadata;
    } catch (error) {
      return null;
    }
  }

  async saveDocContent(
    docsetName: string,
    docId: string,
    content: string
  ): Promise<void> {
    const docsetDir = await this.ensureDocsetDir(docsetName);
    const docsDir = path.join(docsetDir, 'docs');
    await fs.mkdir(docsDir, { recursive: true });

    const filePath = path.join(docsDir, `${docId}.json`);
    await fs.writeFile(filePath, content);
  }

  async loadDocContent(
    docsetName: string,
    docId: string
  ): Promise<string | null> {
    const filePath = path.join(
      this.docuDir,
      docsetName,
      'docs',
      `${docId}.json`
    );

    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      return null;
    }
  }

  async listDocsets(): Promise<string[]> {
    await this.ensureDocuDir();

    try {
      const entries = await fs.readdir(this.docuDir, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory() && entry.name !== 'index')
        .map((entry) => entry.name);
    } catch (error) {
      return [];
    }
  }

  async removeDocset(docsetName: string): Promise<void> {
    const docsetDir = path.join(this.docuDir, docsetName);

    try {
      await fs.rm(docsetDir, { recursive: true });
    } catch (error) {
      // Directory might not exist, which is fine
    }
  }

  async docsetExists(docsetName: string): Promise<boolean> {
    const docsetDir = path.join(this.docuDir, docsetName);

    try {
      const stat = await fs.stat(docsetDir);
      return stat.isDirectory();
    } catch (error) {
      return false;
    }
  }

  getIndexPath(docsetName: string): string {
    return path.join(this.docuDir, 'index', `${docsetName}.db`);
  }

  getBookmarkIndexPath(): string {
    return path.join(this.docuDir, 'index', 'bookmarks.db');
  }
}
