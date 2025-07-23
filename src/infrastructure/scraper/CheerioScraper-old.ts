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
    // Clone the element to avoid modifying the original
    const $element = element.clone();

    // Remove script, style, nav, footer elements
    $element.find('script, style, nav, footer, .nav, .sidebar').remove();

    // Convert code elements to readable format
    $element.find('code, pre').each((_, el) => {
      const $el = element.constructor(el);
      const codeText = $el.text().trim();
      if (codeText.length > 0 && codeText.length < 100) {
        $el.replaceWith(`\`${codeText}\``);
      } else {
        $el.replaceWith(`[Code block: ${codeText.substring(0, 50)}...]`);
      }
    });

    // Convert links to readable format
    $element.find('a').each((_, el) => {
      const $el = element.constructor(el);
      const linkText = $el.text().trim();
      const href = $el.attr('href');
      if (linkText && linkText !== href) {
        $el.replaceWith(linkText);
      }
    });

    // Convert headings to have clear structure
    $element.find('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const $el = element.constructor(el);
      const text = $el.text().trim();
      $el.replaceWith(`\n\n**${text}**\n`);
    });

    // Convert paragraphs to have proper spacing
    $element.find('p').each((_, el) => {
      const $el = element.constructor(el);
      const text = $el.text().trim();
      if (text) {
        $el.replaceWith(`\n${text}\n`);
      }
    });

    // Convert list items
    $element.find('li').each((_, el) => {
      const $el = element.constructor(el);
      const text = $el.text().trim();
      if (text) {
        $el.replaceWith(`\n• ${text}`);
      }
    });

    // Get the final text and clean it up
    let text = $element.text();

    // Clean up whitespace and formatting
    text = text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n /g, '\n') // Remove spaces after newlines
      .replace(/ \n/g, '\n') // Remove spaces before newlines
      .trim();

    // If text is still too messy, try a simpler approach
    if (text.length > 1000 && text.includes('...')) {
      // Fallback to just getting the first few sentences
      const sentences = element
        .text()
        .replace(/\s+/g, ' ')
        .split(/[.!?]+/)
        .slice(0, 3)
        .map((s) => s.trim())
        .filter((s) => s.length > 10);

      text = sentences.join('. ') + (sentences.length > 0 ? '.' : '');
    }

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
