import { SearchDocs } from '../core/SearchDocs';
import { FetchDocs } from '../core/FetchDocs';
import chalk from 'chalk';

export class SmartFetch {
  private searcher = new SearchDocs();
  private fetcher = new FetchDocs();

  // Keywords that suggest specific docsets
  private readonly docsetKeywords = {
    react: [
      'react',
      'jsx',
      'usestate',
      'useeffect',
      'usecontext',
      'component',
      'props',
      'state',
      'hook',
    ],
    vue: [
      'vue',
      'vuejs',
      'composition',
      'reactive',
      'ref',
      'computed',
      'watch',
      'directive',
    ],
    angular: [
      'angular',
      'component',
      'service',
      'directive',
      'pipe',
      'rxjs',
      'observable',
    ],
    nodejs: [
      'nodejs',
      'node',
      'express',
      'npm',
      'require',
      'module',
      'server',
      'http',
    ],
    typescript: [
      'typescript',
      'interface',
      'type',
      'generic',
      'enum',
      'namespace',
      'decorator',
    ],
    python: [
      'python',
      'def',
      'class',
      'import',
      'pip',
      'django',
      'flask',
      'fastapi',
    ],
    docker: [
      'docker',
      'dockerfile',
      'container',
      'image',
      'compose',
      'volume',
      'network',
    ],
    javascript: [
      'javascript',
      'js',
      'function',
      'const',
      'let',
      'var',
      'async',
      'await',
      'promise',
    ],
  };

  async searchWithSuggestedFetch(query: string): Promise<any[]> {
    // First, try searching in existing docsets
    const results = await this.searcher.search(query, { limit: 5 });

    if (results.length > 0) {
      return results;
    }

    // No results found, suggest docsets to fetch
    const suggestedDocsets = this.suggestDocsets(query);

    if (suggestedDocsets.length > 0) {
      console.log(chalk.yellow(`\n🤔 No results found for "${query}"`));
      console.log(chalk.cyan('💡 Suggested docsets to fetch:'));

      suggestedDocsets.forEach((docset, index) => {
        console.log(chalk.gray(`  ${index + 1}. docu fetch ${docset}`));
      });

      console.log(chalk.blue('\n🚀 Or fetch all suggested:'));
      console.log(chalk.gray(`  docu fetch ${suggestedDocsets.join(' ')}`));

      // Ask if they want to auto-fetch
      const shouldAutoFetch = await this.askAutoFetch(suggestedDocsets[0]);

      if (shouldAutoFetch) {
        console.log(chalk.blue(`\n📦 Auto-fetching ${suggestedDocsets[0]}...`));
        await this.fetcher.run(suggestedDocsets[0]);

        // Try searching again
        const newResults = await this.searcher.search(query, { limit: 5 });
        if (newResults.length > 0) {
          console.log(
            chalk.green(
              `\n✅ Found ${newResults.length} results after fetching!`
            )
          );
          return newResults;
        }
      }
    } else {
      console.log(chalk.yellow(`\n🤔 No results found for "${query}"`));
      console.log(chalk.gray('\n💡 Try:'));
      console.log(chalk.gray('  • Different keywords'));
      console.log(chalk.gray('  • Check spelling'));
      console.log(chalk.gray('  • Use `docu available` to see all docsets'));
      console.log(chalk.gray('  • Use `docu fetch <docset>` to download docs'));
    }

    return [];
  }

  private suggestDocsets(query: string): string[] {
    const queryLower = query.toLowerCase();
    const suggestions: { docset: string; score: number }[] = [];

    // Score each docset based on keyword matches
    for (const [docset, keywords] of Object.entries(this.docsetKeywords)) {
      let score = 0;

      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          // Exact match gets higher score
          if (queryLower === keyword) {
            score += 10;
          } else if (
            queryLower.startsWith(keyword) ||
            queryLower.endsWith(keyword)
          ) {
            score += 5;
          } else {
            score += 2;
          }
        }
      }

      if (score > 0) {
        suggestions.push({ docset, score });
      }
    }

    // Sort by score and return top 3
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.docset);
  }

  private async askAutoFetch(docset: string): Promise<boolean> {
    // For now, return false to avoid automatic fetching
    // In the future, we could add interactive prompts
    return false;
  }
}
