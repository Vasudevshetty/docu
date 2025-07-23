import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';

export const interactiveCommand = new Command('interactive')
  .alias('i')
  .description('Start interactive search mode')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .action(async (options: { docset?: string }) => {
    console.log(chalk.bold.blue('🔍 Interactive Search Mode'));
    console.log(
      chalk.gray(
        'Type your search queries (type "exit" to quit, "help" for commands)\n'
      )
    );

    const searcher = new SearchDocs();

    // Simple readline interface for interactive mode
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('docu> '),
    });

    let searchHistory: string[] = [];

    const showHelp = () => {
      console.log(chalk.yellow('\nAvailable commands:'));
      console.log(chalk.gray('  help         - Show this help'));
      console.log(chalk.gray('  exit|quit    - Exit interactive mode'));
      console.log(chalk.gray('  history      - Show search history'));
      console.log(chalk.gray('  clear        - Clear screen'));
      console.log(chalk.gray('  docset <name> - Change docset filter'));
      console.log(chalk.gray('  <query>      - Search for documentation\n'));
    };

    const performSearch = async (query: string) => {
      try {
        const results = await searcher.search(query, {
          docset: options.docset,
          limit: 5, // Smaller limit for interactive mode
        });

        if (results.length === 0) {
          console.log(chalk.yellow(`No results found for "${query}"`));
          return;
        }

        console.log(chalk.green(`\nFound ${results.length} results:\n`));

        results.forEach((result, index) => {
          const number = chalk.cyan(`${index + 1}.`);
          const title = chalk.bold.white(result.title);
          const snippet = result.snippet.substring(0, 100) + '...';
          const docset = chalk.magenta(`[${result.docset}]`);

          console.log(`${number} ${title} ${docset}`);
          console.log(`   ${chalk.gray(snippet)}\n`);
        });

        searchHistory.push(query);
      } catch (error) {
        console.log(
          chalk.red(
            `Search error: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    };

    rl.prompt();

    rl.on('line', async (input: string) => {
      const trimmed = input.trim();

      if (!trimmed) {
        rl.prompt();
        return;
      }

      switch (trimmed.toLowerCase()) {
        case 'exit':
        case 'quit':
          console.log(chalk.blue('Goodbye! 👋'));
          rl.close();
          return;

        case 'help':
          showHelp();
          break;

        case 'history':
          if (searchHistory.length === 0) {
            console.log(chalk.gray('No search history yet.'));
          } else {
            console.log(chalk.yellow('\nSearch History:'));
            searchHistory.slice(-10).forEach((query, index) => {
              console.log(chalk.gray(`  ${index + 1}. ${query}`));
            });
          }
          break;

        case 'clear':
          console.clear();
          console.log(chalk.bold.blue('🔍 Interactive Search Mode'));
          break;

        default:
          if (trimmed.startsWith('docset ')) {
            const newDocset = trimmed.substring(7).trim();
            if (newDocset) {
              options.docset = newDocset;
              console.log(chalk.green(`Docset filter set to: ${newDocset}`));
            } else {
              options.docset = undefined;
              console.log(chalk.green('Docset filter cleared'));
            }
          } else {
            await performSearch(trimmed);
          }
      }

      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  });
