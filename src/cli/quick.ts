import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';
import { GroqService } from '../services/GroqService';
import ora from 'ora';

export const quickCommand = new Command('quick')
  .alias('q')
  .description('Quick reference lookup with AI-powered syntax examples')
  .argument('<query>', 'What to look up quickly')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('--ai', 'Use AI to generate comprehensive quick reference')
  .action(async (query: string, options: { docset?: string; ai?: boolean }) => {
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

      // AI-powered quick reference
      if (options.ai) {
        try {
          const groq = GroqService.fromEnv();
          const spinner = ora('Generating quick reference...').start();

          const framework = result.docset || '';
          const quickRef = await groq.generateQuickReference(query, framework);

          spinner.succeed('Quick reference generated');
          console.log(chalk.bold.green('🤖 AI Quick Reference:'));
          console.log(quickRef);
        } catch (error) {
          console.log(
            chalk.yellow('⚠️  AI quick reference unavailable:'),
            error instanceof Error ? error.message : String(error)
          );

          // Fallback to syntax example
          const syntax = getSyntaxExample(query);
          if (syntax) {
            console.log(chalk.bold.green('📝 Syntax:'));
            console.log(syntax);
            console.log();
          }
        }
      } else {
        // Show syntax if available
        const syntax = getSyntaxExample(query);
        if (syntax) {
          console.log(chalk.bold.green('📝 Syntax:'));
          console.log(syntax);
          console.log();
        }
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
