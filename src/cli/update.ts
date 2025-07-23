import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { FetchDocs } from '../core/FetchDocs';
import { ListDocs } from '../core/ListDocs';

export const updateCommand = new Command('update')
  .description('Update cached docsets with latest content')
  .option('-a, --all', 'Update all cached docsets')
  .option('--check', 'Check for available updates without downloading')
  .argument('[docset]', 'Specific docset to update')
  .action(
    async (
      docset: string | undefined,
      options: {
        all?: boolean;
        check?: boolean;
      }
    ) => {
      try {
        const lister = new ListDocs();
        const cachedDocsets = await lister.getAll();

        if (cachedDocsets.length === 0) {
          console.log(chalk.yellow('No cached docsets found to update.'));
          console.log(
            chalk.gray('Use ') +
              chalk.bold('docu fetch <docset>') +
              chalk.gray(' to download documentation first.')
          );
          return;
        }

        let docsetsToUpdate: string[] = [];

        if (options.all) {
          docsetsToUpdate = cachedDocsets.map((d) => d.name);
        } else if (docset) {
          const exists = cachedDocsets.find((d) => d.name === docset);
          if (!exists) {
            console.log(chalk.red(`Docset "${docset}" is not cached.`));
            console.log(
              chalk.gray('Available docsets: ') +
                cachedDocsets.map((d) => d.name).join(', ')
            );
            return;
          }
          docsetsToUpdate = [docset];
        } else {
          // Interactive selection
          console.log(chalk.blue('Select docsets to update:\n'));
          cachedDocsets.forEach((ds, index) => {
            const age = getAgeString(ds.metadata.lastFetched);
            console.log(
              `${chalk.cyan(index + 1)}. ${chalk.bold(ds.name)} ${chalk.gray(`(last updated ${age})`)}`
            );
          });
          console.log(
            chalk.gray('\nUse --all to update all, or specify a docset name')
          );
          return;
        }

        if (options.check) {
          await checkForUpdates(docsetsToUpdate, cachedDocsets);
          return;
        }

        // Perform updates
        const fetcher = new FetchDocs();

        for (const docsetName of docsetsToUpdate) {
          const spinner = ora(`Updating ${chalk.blue(docsetName)}...`).start();

          try {
            await fetcher.run(docsetName, true); // Force update
            spinner.succeed(chalk.green(`Updated ${docsetName}`));
          } catch (error) {
            spinner.fail(chalk.red(`Failed to update ${docsetName}`));
            console.error(
              chalk.gray(
                `  ${error instanceof Error ? error.message : String(error)}`
              )
            );
          }
        }

        console.log(
          chalk.green(
            `\n✅ Update complete! Updated ${docsetsToUpdate.length} docset(s)`
          )
        );
      } catch (error) {
        console.error(
          chalk.red('❌ Update failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );

async function checkForUpdates(
  docsetNames: string[],
  cachedDocsets: any[]
): Promise<void> {
  console.log(chalk.blue('🔍 Checking for updates...\n'));

  for (const docsetName of docsetNames) {
    const cached = cachedDocsets.find((d) => d.name === docsetName);
    if (!cached) continue;

    const age = getAgeString(cached.metadata.lastFetched);
    const needsUpdate = isUpdateNeeded(cached.metadata.lastFetched);

    const status = needsUpdate
      ? chalk.yellow('⚠️  Update available')
      : chalk.green('✅ Up to date');
    console.log(
      `${chalk.bold(docsetName.padEnd(12))} ${status} ${chalk.gray(`(${age})`)}`
    );
  }

  console.log(
    chalk.gray('\nUse ') +
      chalk.bold('docu update <docset>') +
      chalk.gray(' to update a specific docset')
  );
}

function getAgeString(lastFetched: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - lastFetched.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function isUpdateNeeded(lastFetched: Date): boolean {
  const now = new Date();
  const diffMs = now.getTime() - lastFetched.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Consider update needed if older than 7 days
  return diffDays > 7;
}
