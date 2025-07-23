import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';

export const searchCommand = new Command('search')
  .description('Search through cached documentation')
  .argument('<query>', 'Search query')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('-l, --limit <number>', 'Maximum number of results', '10')
  .option('--min-score <score>', 'Minimum relevance score', '0.000001')
  .option('--no-highlight', 'Disable syntax highlighting in snippets')
  .option('--format <format>', 'Output format: table, json, plain', 'table')
  .action(
    async (
      query: string,
      options: {
        docset?: string;
        limit?: string;
        minScore?: string;
        highlight?: boolean;
        format?: string;
      }
    ) => {
      try {
        const searcher = new SearchDocs();
        const results = await searcher.search(query, {
          docset: options.docset,
          limit: parseInt(options.limit || '10', 10),
          minScore: parseFloat(options.minScore || '0.000001'),
        });

        if (results.length === 0) {
          console.log(chalk.yellow(`No results found for "${query}"`));
          console.log(chalk.gray('\nTips:'));
          console.log(chalk.gray('  • Try different keywords'));
          console.log(chalk.gray('  • Check spelling'));
          console.log(
            chalk.gray('  • Use `docu list` to see available docsets')
          );
          console.log(
            chalk.gray('  • Use `docu fetch <docset>` to download more docs')
          );
          return;
        }

        // Handle different output formats
        if (options.format === 'json') {
          console.log(JSON.stringify(results, null, 2));
          return;
        }

        const totalText = results.length === 1 ? 'result' : 'results';
        console.log(
          chalk.green(`Found ${results.length} ${totalText} for "${query}":\n`)
        );

        if (options.format === 'plain') {
          results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.title}`);
            console.log(`   ${result.url}`);
            console.log(`   ${result.snippet.replace(/\*\*/g, '')}`);
            console.log(
              `   Score: ${result.score.toFixed(6)} | Docset: ${result.docset}\n`
            );
          });
        } else {
          // Enhanced table format (default)
          results.forEach((result, index) => {
            const number = chalk.cyan(`${index + 1}.`);
            const title = chalk.bold.blue(result.title);
            const url = chalk.gray(result.url);
            const snippet =
              options.highlight !== false
                ? result.snippet
                : result.snippet.replace(/\*\*/g, '');
            const scoreText = chalk.yellow(`Score: ${result.score.toFixed(6)}`);
            const docsetText = chalk.magenta(`Docset: ${result.docset}`);

            console.log(`${number} ${title}`);
            console.log(`   🔗 ${url}`);
            console.log(`   📝 ${snippet}`);
            console.log(`   📊 ${scoreText} | 📚 ${docsetText}\n`);
          });
        }

        // Show summary
        const uniqueDocsets = [...new Set(results.map((r) => r.docset))];
        if (uniqueDocsets.length > 1) {
          console.log(
            chalk.gray(
              `Results from ${uniqueDocsets.length} docsets: ${uniqueDocsets.join(', ')}`
            )
          );
        }
      } catch (error) {
        console.error(
          chalk.red('🔍 Search failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );
