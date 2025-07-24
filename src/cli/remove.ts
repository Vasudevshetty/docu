import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { RemoveDocs } from '../core/RemoveDocs.js';

export const removeCommand = new Command('remove')
  .description('Remove a cached docset')
  .argument('<docset>', 'Name of the docset to remove')
  .action(async (docset: string) => {
    const spinner = ora(
      `Removing ${chalk.blue(docset)} documentation...`
    ).start();

    try {
      const remover = new RemoveDocs();
      await remover.remove(docset);

      spinner.succeed(
        chalk.green(`Successfully removed ${docset} documentation!`)
      );
    } catch (error) {
      spinner.fail(chalk.red(`Failed to remove ${docset} documentation`));
      console.error(
        chalk.red(error instanceof Error ? error.message : String(error))
      );
      process.exit(1);
    }
  });
