import { Command } from 'commander';
import chalk from 'chalk';
import { ListDocs } from '../core/ListDocs';

export const listCommand = new Command('list')
  .description('List all cached docsets')
  .option('-v, --verbose', 'Show detailed information')
  .action(async (options: { verbose?: boolean }) => {
    try {
      const lister = new ListDocs();
      const docsets = await lister.getAll();

      if (docsets.length === 0) {
        console.log(
          chalk.yellow(
            'No docsets cached. Use "docu fetch <docset>" to download documentation.'
          )
        );
        return;
      }

      console.log(chalk.green(`Found ${docsets.length} cached docset(s):\n`));

      docsets.forEach((docset) => {
        console.log(chalk.blue(`📚 ${docset.name}`));
        console.log(
          chalk.gray(`   Description: ${docset.metadata.description}`)
        );
        console.log(chalk.gray(`   Documents: ${docset.metadata.totalDocs}`));
        console.log(
          chalk.gray(
            `   Last fetched: ${docset.metadata.lastFetched.toLocaleDateString()}`
          )
        );

        if (options.verbose) {
          console.log(chalk.gray(`   Version: ${docset.metadata.version}`));
          console.log(chalk.gray(`   Base URL: ${docset.metadata.baseUrl}`));
        }

        console.log();
      });
    } catch (error) {
      console.error(
        chalk.red('Failed to list docsets:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
