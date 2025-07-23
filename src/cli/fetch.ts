import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { FetchDocs } from '../core/FetchDocs';

export const fetchCommand = new Command('fetch')
  .description('Fetch and cache documentation for a specific docset')
  .argument(
    '<docset>',
    'Name of the docset to fetch (e.g., react, nodejs, python)'
  )
  .option('-f, --force', 'Force re-fetch even if already cached')
  .action(async (docset: string, options: { force?: boolean }) => {
    const spinner = ora(
      `Fetching ${chalk.blue(docset)} documentation...`
    ).start();

    try {
      const fetcher = new FetchDocs();
      await fetcher.run(docset, options.force);

      spinner.succeed(
        chalk.green(`Successfully fetched ${docset} documentation!`)
      );
      console.log(chalk.gray(`Cached in ~/.docu/${docset}/`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to fetch ${docset} documentation`));
      console.error(
        chalk.red(error instanceof Error ? error.message : String(error))
      );
      process.exit(1);
    }
  });
