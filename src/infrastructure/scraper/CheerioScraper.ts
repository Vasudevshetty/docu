import axios from 'axios';
import * as cheerio from 'cheerio';
import { DocContent } from '../../domain/Docset';

export interface ScrapeRules {
  entryPoints: string[];
  selectors: {
    title: string;
    content: string;
    exclude: string;
  };
}

export class CheerioScraper {
  async scrapeDocset(
    baseUrl: string,
    rules: ScrapeRules
  ): Promise<DocContent[]> {
    const docs: DocContent[] = [];

    for (const entryPoint of rules.entryPoints) {
      try {
        const pageResults = await this.scrapePage(entryPoint, rules);
        docs.push(...pageResults);
      } catch (error) {
        console.warn(`Failed to scrape ${entryPoint}:`, error);
      }
    }

    return docs;
  }

  private async scrapePage(
    url: string,
    rules: ScrapeRules
  ): Promise<DocContent[]> {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'docu-cli/1.0.0 (Documentation Scraper)',
      },
    });

    const $ = cheerio.load(response.data);

    // Remove excluded elements
    $(rules.selectors.exclude).remove();

    const docs: DocContent[] = [];

    // Extract main content
    const mainContent = $(rules.selectors.content).first();
    if (mainContent.length > 0) {
      const headings = this.extractHeadings($, rules.selectors.title);
      const content = this.extractCleanText(mainContent);

      if (content.trim().length > 0) {
        docs.push({
          id: this.generateId(url),
          title: headings[0] || this.extractTitleFromUrl(url),
          url,
          content,
          headings,
          lastUpdated: new Date(),
        });
      }
    }

    return docs;
  }

  private extractHeadings($: cheerio.CheerioAPI, selector: string): string[] {
    const headings: string[] = [];

    $(selector).each((_, element) => {
      const heading = $(element).text().trim();
      if (heading && !headings.includes(heading)) {
        headings.push(heading);
      }
    });

    return headings;
  }

  private extractCleanText(element: cheerio.Cheerio<any>): string {
    // Remove code blocks and preserve their content with markers
    let text = element.text();

    // Clean up extra whitespace
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return text;
  }

  private generateId(url: string): string {
    // Create a simple hash from URL
    const hash = url
      .replace(/https?:\/\//, '')
      .replace(/[^\w\-]/g, '_')
      .toLowerCase();

    return `${hash}_${Date.now()}`;
  }

  private extractTitleFromUrl(url: string): string {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2];

    return (
      lastPart
        .replace(/[-_]/g, ' ')
        .replace(/\.(html?|php)$/, '')
        .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Untitled'
    );
  }
}
