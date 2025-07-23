import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';

export const searchCommand = new Command('search')
  .description('Search through cached documentation')
  .argument('<query>', 'Search query')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('-l, --limit <number>', 'Maximum number of results', '10')
  .action(
    async (query: string, options: { docset?: string; limit?: string }) => {
      try {
        const searcher = new SearchDocs();
        const results = await searcher.search(query, {
          docset: options.docset,
          limit: parseInt(options.limit || '10', 10),
        });

        if (results.length === 0) {
          console.log(chalk.yellow(`No results found for "${query}"`));
          return;
        }

        console.log(
          chalk.green(`Found ${results.length} results for "${query}":\n`)
        );

        results.forEach((result, index) => {
          console.log(chalk.blue(`${index + 1}. ${result.title}`));
          console.log(chalk.gray(`   ${result.url}`));
          console.log(chalk.white(`   ${result.snippet}`));
          console.log(
            chalk.gray(
              `   Score: ${result.score.toFixed(2)} | Docset: ${result.docset}\n`
            )
          );
        });
      } catch (error) {
        console.error(
          chalk.red('Search failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );
