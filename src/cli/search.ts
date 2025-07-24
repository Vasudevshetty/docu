import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';
import { MarkdownPager } from '../utils/MarkdownPager';
import { GroqService } from '../services/GroqService';
import { SmartFetch } from '../utils/SmartFetch';
import ora from 'ora';

function generateMarkdownOutput(
  query: string,
  results: any[],
  aiInsights: string
): string {
  let output = `# Search Results for "${query}"\n\n`;

  if (aiInsights) {
    output += `## 🤖 AI Insights\n\n${aiInsights}\n\n`;
  }

  output += `## 📚 Results (${results.length})\n\n`;

  results.forEach((result, index) => {
    output += `### ${index + 1}. ${result.title}\n\n`;
    output += `**URL:** ${result.url}\n\n`;
    output += `**Docset:** ${result.docset} | **Score:** ${result.score.toFixed(6)}\n\n`;
    output += `${result.content || result.snippet}\n\n---\n\n`;
  });

  return output;
}

function generateTableOutput(
  query: string,
  results: any[],
  options: any,
  aiInsights: string
): string {
  let output = '';

  if (aiInsights) {
    output += chalk.bold.cyan('🤖 AI Insights:\n');
    output += chalk.white(aiInsights) + '\n\n';
  }

  const totalText = results.length === 1 ? 'result' : 'results';
  output += chalk.green(
    `Found ${results.length} ${totalText} for "${query}":\n\n`
  );

  if (options.format === 'plain') {
    results.forEach((result, index) => {
      output += `${index + 1}. ${result.title}\n`;
      output += `   ${result.url}\n`;
      output += `   ${result.snippet.replace(/\*\*/g, '')}\n`;
      output += `   Score: ${result.score.toFixed(6)} | Docset: ${result.docset}\n\n`;
    });
  } else {
    // Enhanced table format (default)
    results.forEach((result, index) => {
      const number = chalk.cyan(`${index + 1}.`);
      const title = chalk.bold.blue(result.title);
      const url = chalk.gray(result.url);
      const snippet =
        options.highlight !== false
          ? result.snippet
          : result.snippet.replace(/\*\*/g, '');
      const scoreText = chalk.yellow(`Score: ${result.score.toFixed(6)}`);
      const docsetText = chalk.magenta(`Docset: ${result.docset}`);

      output += `${number} ${title}\n`;
      output += `   🔗 ${url}\n`;
      output += `   📝 ${snippet}\n`;
      output += `   📊 ${scoreText} | 📚 ${docsetText}\n\n`;
    });
  }

  // Show summary
  const uniqueDocsets = [...new Set(results.map((r) => r.docset))];
  if (uniqueDocsets.length > 1) {
    output += chalk.gray(
      `Results from ${uniqueDocsets.length} docsets: ${uniqueDocsets.join(', ')}`
    );
  }

  return output;
}

export const searchCommand = new Command('search')
  .description(
    'Search through cached documentation with AI insights and smart fetch suggestions'
  )
  .argument('<query>', 'Search query')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('-l, --limit <number>', 'Maximum number of results', '10')
  .option('--min-score <score>', 'Minimum relevance score', '0.000001')
  .option('--no-highlight', 'Disable syntax highlighting in snippets')
  .option(
    '--format <format>',
    'Output format: table, json, plain, markdown',
    'table'
  )
  .option('--ai', 'Enable AI-powered explanations and insights')
  .option('--pager', 'Display results in a paginated viewer')
  .option('--smart', 'Use smart fetch suggestions if no results found')
  .action(
    async (
      query: string,
      options: {
        docset?: string;
        limit?: string;
        minScore?: string;
        highlight?: boolean;
        format?: string;
        ai?: boolean;
        pager?: boolean;
        smart?: boolean;
      }
    ) => {
      try {
        let results;

        // Use smart fetch if enabled
        if (options.smart) {
          const smartFetch = new SmartFetch();
          results = await smartFetch.searchWithSuggestedFetch(query);
        } else {
          const searcher = new SearchDocs();
          results = await searcher.search(query, {
            docset: options.docset,
            limit: parseInt(options.limit || '10', 10),
            minScore: parseFloat(options.minScore || '0.000001'),
          });
        }

        if (results.length === 0) {
          console.log(chalk.yellow(`No results found for "${query}"`));
          console.log(chalk.gray('\nTips:'));
          console.log(chalk.gray('  • Try different keywords'));
          console.log(chalk.gray('  • Check spelling'));
          console.log(
            chalk.gray('  • Use `docu list` to see available docsets')
          );
          console.log(
            chalk.gray('  • Use `docu fetch <docset>` to download more docs')
          );
          return;
        }

        // AI Enhancement
        let aiInsights = '';
        if (options.ai) {
          try {
            const groq = GroqService.fromEnv();
            const spinner = ora('Generating AI insights...').start();
            aiInsights = await groq.enhanceSearchResults(query, results);
            spinner.succeed('AI insights generated');
          } catch (error) {
            console.log(
              chalk.yellow('⚠️  AI insights unavailable:'),
              error instanceof Error ? error.message : String(error)
            );
          }
        }

        // Handle different output formats
        if (options.format === 'json') {
          console.log(JSON.stringify({ results, aiInsights }, null, 2));
          return;
        }

        let output = '';

        // Generate output content
        if (options.format === 'markdown') {
          output = generateMarkdownOutput(query, results, aiInsights);
        } else {
          output = generateTableOutput(query, results, options, aiInsights);
        }

        // Display with pager if requested
        if (options.pager) {
          const pager = new MarkdownPager(output);
          await pager.display();
        } else {
          console.log(output);
        }
      } catch (error) {
        console.error(
          chalk.red('🔍 Search failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );
