import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { SearchDocs } from '../core/SearchDocs';

export const exportCommand = new Command('export')
  .description('Export search results to a file')
  .argument('<query>', 'Search query to export')
  .option('-o, --output <file>', 'Output file path', 'search-results.md')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('-l, --limit <number>', 'Maximum number of results', '50')
  .option(
    '-f, --format <format>',
    'Export format: markdown, json, txt',
    'markdown'
  )
  .action(
    async (
      query: string,
      options: {
        output?: string;
        docset?: string;
        limit?: string;
        format?: string;
      }
    ) => {
      try {
        console.log(chalk.blue(`🔍 Searching for "${query}"...`));

        const searcher = new SearchDocs();
        const results = await searcher.search(query, {
          docset: options.docset,
          limit: parseInt(options.limit || '50', 10),
        });

        if (results.length === 0) {
          console.log(chalk.yellow(`No results found for "${query}"`));
          return;
        }

        const outputPath = path.resolve(options.output || 'search-results.md');
        const format = (options.format || 'markdown').toLowerCase();

        let content = '';
        const timestamp = new Date().toISOString();

        switch (format) {
          case 'json':
            content = JSON.stringify(
              {
                query,
                timestamp,
                total: results.length,
                docset: options.docset,
                results,
              },
              null,
              2
            );
            break;

          case 'txt':
            content = `Search Results for "${query}"\n`;
            content += `Generated: ${timestamp}\n`;
            content += `Total Results: ${results.length}\n`;
            if (options.docset) content += `Docset: ${options.docset}\n`;
            content += `\n${'='.repeat(50)}\n\n`;

            results.forEach((result, index) => {
              content += `${index + 1}. ${result.title}\n`;
              content += `URL: ${result.url}\n`;
              content += `Docset: ${result.docset}\n`;
              content += `Score: ${result.score.toFixed(6)}\n`;
              content += `\n${result.snippet.replace(/\*\*/g, '')}\n\n`;
              content += `${'-'.repeat(30)}\n\n`;
            });
            break;

          case 'markdown':
          default:
            content = `# Search Results for "${query}"\n\n`;
            content += `**Generated:** ${timestamp}  \n`;
            content += `**Total Results:** ${results.length}  \n`;
            if (options.docset) content += `**Docset:** ${options.docset}  \n`;
            content += `\n---\n\n`;

            results.forEach((result, index) => {
              content += `## ${index + 1}. ${result.title}\n\n`;
              content += `**URL:** [${result.url}](${result.url})  \n`;
              content += `**Docset:** ${result.docset}  \n`;
              content += `**Score:** ${result.score.toFixed(6)}  \n\n`;
              content += `### Snippet\n\n`;
              content += `${result.snippet}\n\n`;
              content += `---\n\n`;
            });
            break;
        }

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write file
        fs.writeFileSync(outputPath, content, 'utf-8');

        console.log(
          chalk.green(`✅ Exported ${results.length} results to ${outputPath}`)
        );
        console.log(chalk.gray(`   Format: ${format}`));
        console.log(
          chalk.gray(`   File size: ${(content.length / 1024).toFixed(1)} KB`)
        );
      } catch (error) {
        console.error(
          chalk.red('❌ Export failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );
