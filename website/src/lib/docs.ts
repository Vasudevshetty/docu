import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface DocMeta {
  title: string;
  description: string;
  [key: string]: any;
}

export interface Doc {
  slug: string;
  meta: DocMeta;
  content: string;
  html: string;
}

const docsDirectory = path.join(process.cwd(), 'src/data/docs');

export async function getDocContent(slug: string): Promise<Doc | null> {
  try {
    const filePath = path.join(docsDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');

    const { data, content } = matter(fileContent);
    const html = await marked(content);

    return {
      slug,
      meta: data as DocMeta,
      content,
      html,
    };
  } catch (error) {
    return null;
  }
}

export async function getAllDocs(): Promise<Doc[]> {
  try {
    const files = await fs.readdir(docsDirectory);
    const docs = await Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const slug = file.replace('.md', '');
          return getDocContent(slug);
        })
    );

    return docs.filter((doc): doc is Doc => doc !== null);
  } catch (error) {
    return [];
  }
}
