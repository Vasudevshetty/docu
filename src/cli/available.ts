import { Command } from 'commander';
import chalk from 'chalk';
import docsets from '../config/docsets.json';
import { DocsetConfig } from '../domain/Docset';

export function setupAvailableCommand(program: Command): void {
  program
    .command('available')
    .alias('browse')
    .description('Show all available docsets that can be fetched')
    .action(async () => {
      console.log(chalk.bold.blue('\n📚 Available Docsets:\n'));

      docsets.forEach((docset: DocsetConfig, index: number) => {
        const number = chalk.gray(
          `${(index + 1).toString().padStart(2, ' ')}.`
        );
        const name = chalk.bold.green(docset.name.padEnd(12));
        const description = chalk.white(docset.description);
        const url = chalk.gray(`(${docset.baseUrl})`);

        console.log(`${number} ${name} ${description} ${url}`);
      });

      console.log(
        chalk.gray('\nUse ') +
          chalk.bold('docu fetch <name>') +
          chalk.gray(' to download and index a docset.')
      );
      console.log(
        chalk.gray('Use ') +
          chalk.bold('docu list') +
          chalk.gray(' to see installed docsets.\n')
      );
    });
}
