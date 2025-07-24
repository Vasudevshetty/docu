import { Command } from 'commander';
import chalk from 'chalk';
import { ListDocs } from '../core/ListDocs.js';

export const listCommand = new Command('list')
  .description('List all cached docsets')
  .option('-v, --verbose', 'Show detailed information')
  .option('--stats', 'Show storage statistics')
  .option('--json', 'Output as JSON')
  .action(
    async (options: { verbose?: boolean; stats?: boolean; json?: boolean }) => {
      try {
        const lister = new ListDocs();
        const docsets = await lister.getAll();

        if (docsets.length === 0) {
          if (options.json) {
            console.log(JSON.stringify({ docsets: [], total: 0 }, null, 2));
            return;
          }

          console.log(chalk.yellow('📦 No docsets cached yet\n'));
          console.log(chalk.gray('💡 Tips:'));
          console.log(
            chalk.gray('   • Use ') +
              chalk.bold('docu available') +
              chalk.gray(' to see available docsets')
          );
          console.log(
            chalk.gray('   • Use ') +
              chalk.bold('docu fetch <docset>') +
              chalk.gray(' to download documentation')
          );
          console.log(
            chalk.gray('   • Example: ') + chalk.cyan('docu fetch react')
          );
          return;
        }

        if (options.json) {
          const jsonOutput = {
            total: docsets.length,
            docsets: docsets.map((docset) => ({
              name: docset.name,
              description: docset.metadata.description,
              totalDocs: docset.metadata.totalDocs,
              lastFetched: docset.metadata.lastFetched,
              version: docset.metadata.version,
              baseUrl: docset.metadata.baseUrl,
            })),
          };
          console.log(JSON.stringify(jsonOutput, null, 2));
          return;
        }

        console.log(
          chalk.bold.green(`📚 Cached Docsets (${docsets.length} total):\n`)
        );

        // Calculate totals for stats
        const totalDocs = docsets.reduce(
          (sum, docset) => sum + docset.metadata.totalDocs,
          0
        );
        const mostRecent = docsets.reduce(
          (latest, docset) =>
            docset.metadata.lastFetched > latest
              ? docset.metadata.lastFetched
              : latest,
          new Date(0)
        );

        docsets.forEach((docset, index) => {
          const number = chalk.gray(
            `${(index + 1).toString().padStart(2, ' ')}.`
          );
          const name = chalk.bold.blue(docset.name.padEnd(12));
          const docs = chalk.cyan(
            `${docset.metadata.totalDocs.toString().padStart(3)} docs`
          );
          const date = chalk.gray(
            docset.metadata.lastFetched.toLocaleDateString()
          );

          console.log(`${number} ${name} ${docs} ${chalk.gray('•')} ${date}`);

          if (options.verbose) {
            console.log(
              `    ${chalk.gray('Description:')} ${docset.metadata.description}`
            );
            console.log(
              `    ${chalk.gray('Version:')} ${docset.metadata.version}`
            );
            console.log(
              `    ${chalk.gray('Base URL:')} ${docset.metadata.baseUrl}`
            );
            console.log();
          } else if (!options.verbose) {
            console.log(`    ${chalk.white(docset.metadata.description)}`);
          }
        });

        if (options.stats) {
          console.log(chalk.yellow('\n📊 Statistics:'));
          console.log(
            chalk.gray(
              `   Total documents indexed: ${totalDocs.toLocaleString()}`
            )
          );
          console.log(
            chalk.gray(
              `   Most recent update: ${mostRecent.toLocaleDateString()}`
            )
          );
          console.log(
            chalk.gray(
              `   Average docs per docset: ${Math.round(totalDocs / docsets.length)}`
            )
          );
        }

        if (!options.verbose && !options.stats) {
          console.log(
            chalk.gray('\n💡 Use ') +
              chalk.bold('--verbose') +
              chalk.gray(' for more details, ') +
              chalk.bold('--stats') +
              chalk.gray(' for statistics')
          );
        }
      } catch (error) {
        console.error(
          chalk.red('❌ Failed to list docsets:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );
