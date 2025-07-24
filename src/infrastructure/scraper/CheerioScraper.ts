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
    let successCount = 0;
    let errorCount = 0;

    console.log(`📄 Scraping ${rules.entryPoints.length} pages...`);

    for (let i = 0; i < rules.entryPoints.length; i++) {
      const entryPoint = rules.entryPoints[i];
      try {
        const pageResults = await this.scrapePage(entryPoint, rules);
        docs.push(...pageResults);

        if (pageResults.length > 0) {
          successCount++;
          console.log(
            `✅ ${i + 1}/${rules.entryPoints.length}: ${pageResults.length} docs from ${this.shortenUrl(entryPoint)}`
          );
        } else {
          console.log(
            `⚪ ${i + 1}/${rules.entryPoints.length}: No content from ${this.shortenUrl(entryPoint)}`
          );
        }
      } catch (error) {
        errorCount++;
        console.warn(
          `❌ ${i + 1}/${rules.entryPoints.length}: Failed to scrape ${this.shortenUrl(entryPoint)}`
        );
      }
    }

    console.log(
      `\n📊 Scraping completed: ${successCount} successful, ${errorCount} errors, ${docs.length} total documents`
    );
    return docs;
  }

  private shortenUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }

  private async scrapePage(
    url: string,
    rules: ScrapeRules
  ): Promise<DocContent[]> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'docu-cli/1.0.0 (Documentation Scraper)',
        },
        validateStatus: (status) => {
          // Accept 2xx status codes
          return status >= 200 && status < 300;
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
        const content = this.extractCleanText($, mainContent);

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
    } catch (error: any) {
      // Handle different types of errors gracefully
      if (error.response) {
        // HTTP error (4xx, 5xx)
        const status = error.response.status;
        const statusText = error.response.statusText;

        if (status === 404) {
          console.warn(`⚠️  Page not found (404): ${url}`);
        } else if (status >= 400 && status < 500) {
          console.warn(`⚠️  Client error (${status}): ${url} - ${statusText}`);
        } else if (status >= 500) {
          console.warn(`⚠️  Server error (${status}): ${url} - ${statusText}`);
        } else {
          console.warn(`⚠️  HTTP error (${status}): ${url} - ${statusText}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        console.warn(`⏱️  Timeout scraping: ${url}`);
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.warn(`🌐 Network error scraping: ${url}`);
      } else {
        console.warn(`❌ Error scraping ${url}:`, error.message);
      }

      // Return empty array instead of throwing
      return [];
    }
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

  private extractCleanText(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<any>
  ): string {
    // Remove unwanted elements first
    const $elem = element.clone();
    $elem
      .find(
        'script, style, nav, footer, .nav, .sidebar, .breadcrumb, .toc, .table-of-contents'
      )
      .remove();

    // Extract structured content with markdown
    let content = '';

    // Process each child element to maintain structure
    $elem.children().each((_, child) => {
      const $child = $(child);
      const tagName = child.name?.toLowerCase();

      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          const level = '#'.repeat(parseInt(tagName[1]));
          content += `\n${level} ${$child.text().trim()}\n\n`;
          break;

        case 'p':
          const pText = $child.text().trim();
          if (pText && pText.length > 10) {
            content += `${pText}\n\n`;
          }
          break;

        case 'ul':
        case 'ol':
          $child.find('li').each((_: number, li: any) => {
            const liText = element.constructor(li).text().trim();
            if (liText) {
              content += `• ${liText}\n`;
            }
          });
          content += '\n';
          break;

        case 'pre':
        case 'code':
          const codeText = $child.text().trim();
          if (codeText && codeText.length < 500) {
            content += `\n\`\`\`\n${codeText}\n\`\`\`\n\n`;
          }
          break;

        case 'blockquote':
          const quoteText = $child.text().trim();
          if (quoteText) {
            content += `> ${quoteText}\n\n`;
          }
          break;

        default:
          const defaultText = $child.text().trim();
          if (
            defaultText &&
            defaultText.length > 20 &&
            defaultText.length < 300
          ) {
            content += `${defaultText}\n\n`;
          }
      }
    });

    // Fallback: if no structured content, extract clean sentences
    if (!content || content.trim().length < 100) {
      const sentences = element
        .text()
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20 && s.length < 300)
        .slice(0, 5);

      content = sentences.join('. ') + (sentences.length > 0 ? '.' : '');
    }

    // Clean up the content
    return content
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/\n /g, '\n') // Remove spaces after newlines
      .trim();
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
