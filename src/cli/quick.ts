import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';

export const quickCommand = new Command('quick')
  .alias('q')
  .description('Quick reference lookup with syntax examples')
  .argument('<query>', 'What to look up quickly')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .action(async (query: string, options: { docset?: string }) => {
    try {
      const searcher = new SearchDocs();
      const results = await searcher.search(query, {
        docset: options.docset,
        limit: 1,
      });

      if (results.length === 0) {
        console.log(chalk.yellow(`❌ No quick reference found for "${query}"`));
        return;
      }

      const result = results[0];

      // Quick reference format
      console.log(chalk.bold.blue(`⚡ ${result.title}`));
      console.log(chalk.blue(`🔗 ${result.url}\n`));

      // Show syntax if available
      const syntax = getSyntaxExample(query);
      if (syntax) {
        console.log(chalk.bold.green('📝 Syntax:'));
        console.log(syntax);
        console.log();
      }

      // Show quick description
      console.log(chalk.bold.cyan('📖 Description:'));
      console.log(chalk.white(result.snippet.substring(0, 200) + '...'));

      console.log(
        chalk.gray('\n💡 Use ') +
          chalk.bold(`docu explain ${query}`) +
          chalk.gray(' for detailed explanation')
      );
    } catch (error) {
      console.error(
        chalk.red('❌ Quick lookup failed:'),
        error instanceof Error ? error.message : String(error)
      );
    }
  });

function getSyntaxExample(query: string): string | null {
  const syntaxExamples: { [key: string]: string } = {
    usestate: chalk.green('const [state, setState] = useState(initialValue);'),
    useeffect: chalk.green(
      'useEffect(() => { /* effect */ }, [dependencies]);'
    ),
    map: chalk.green('array.map((item, index) => { return newItem; });'),
    filter: chalk.green('array.filter((item) => condition);'),
    reduce: chalk.green('array.reduce((acc, curr) => acc + curr, 0);'),
    fetch: chalk.green(
      'fetch(url).then(response => response.json()).then(data => {});'
    ),
    async: chalk.green(
      'async function name() { const result = await promise; }'
    ),
  };

  return syntaxExamples[query.toLowerCase()] || null;
}
