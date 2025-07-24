import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';
import { GroqService } from '../services/GroqService';
import { MarkdownPager } from '../utils/MarkdownPager';
import ora from 'ora';

export const explainCommand = new Command('explain')
  .description('Get AI-powered explanations and code examples')
  .argument('<query>', 'What to explain (e.g., "useState", "useEffect")')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('--examples', 'Include code examples')
  .option('--simple', 'Simple explanation for beginners')
  .option('--pager', 'Display explanation in a paginated viewer')
  .action(
    async (
      query: string,
      options: {
        docset?: string;
        examples?: boolean;
        simple?: boolean;
        pager?: boolean;
      }
    ) => {
      try {
        const spinner = ora(`Explaining "${query}"...`).start();

        // First, search for relevant documentation
        const searcher = new SearchDocs();
        const results = await searcher.search(query, {
          docset: options.docset,
          limit: 3,
        });

        // Generate AI explanation using Groq
        let explanation = '';
        try {
          const groq = GroqService.fromEnv();

          // Prepare context from search results
          const context = results
            .map((r) => `${r.title}: ${r.snippet}`)
            .join('\n\n');

          // Create a comprehensive prompt
          const prompt = options.simple
            ? `Explain "${query}" in simple terms for beginners.`
            : `Provide a detailed technical explanation of "${query}".`;

          explanation = await groq.explainCode(
            query,
            context + '\n\n' + prompt
          );
          spinner.succeed('AI explanation generated');
        } catch (error) {
          spinner.fail('AI explanation failed');
          console.log(
            chalk.yellow('⚠️  AI explanation unavailable:'),
            error instanceof Error ? error.message : String(error)
          );

          // Fallback to documentation-based explanation
          explanation = generateFallbackExplanation(
            query,
            results,
            options.simple
          );
        }

        // Format output
        let output = `# Explanation: ${query}\n\n`;
        output += `${explanation}\n\n`;

        if (options.examples) {
          output += `## 💻 Code Examples\n\n`;
          output += generateCodeExamples(query) + '\n\n';
        }

        if (results.length > 0) {
          output += `## 🔗 Related Documentation\n\n`;
          results.slice(0, 2).forEach((result, index) => {
            output += `${index + 1}. **${result.title}**\n`;
            output += `   ${result.url}\n\n`;
          });
        }

        // Display with pager if requested, otherwise use markdown rendering
        if (options.pager) {
          const pager = new MarkdownPager(output);
          await pager.display();
        } else {
          // Render markdown directly to console
          const pager = new MarkdownPager(output);
          console.log(pager.formatMarkdown(output));
        }
      } catch (error) {
        console.error(
          chalk.red('❌ Explanation failed:'),
          chalk.yellow(error instanceof Error ? error.message : String(error))
        );

        console.log(chalk.gray('\n💡 Troubleshooting tips:'));
        console.log(chalk.gray('  • Check your internet connection'));
        console.log(chalk.gray('  • Verify your API key with: docu setup'));
        console.log(chalk.gray('  • Try a simpler query'));
        console.log(
          chalk.gray('  • Use docu search instead for basic documentation')
        );

        process.exit(1);
      }
    }
  );

function generateFallbackExplanation(
  query: string,
  results: any[],
  simple?: boolean
): string {
  const explanations: { [key: string]: { simple: string; detailed: string } } =
    {
      react: {
        simple:
          'React is a JavaScript library for building user interfaces with reusable components.',
        detailed:
          'React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".',
      },
      usestate: {
        simple:
          'useState is a React Hook that lets you add state (data that can change) to functional components.',
        detailed:
          'useState is a Hook that allows you to have state variables in functional components. It returns an array with two elements: the current state value and a function that lets you update it.',
      },
      useeffect: {
        simple:
          'useEffect runs code when your component mounts, updates, or unmounts.',
        detailed:
          'useEffect is a Hook that lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.',
      },
      component: {
        simple:
          'A component is a reusable piece of UI code that can accept inputs (props) and return what should appear on the screen.',
        detailed:
          'Components are the building blocks of React applications. They are JavaScript functions or classes that optionally accept inputs (called "props") and return React elements describing what should appear on the screen.',
      },
    };

  const key = query.toLowerCase();
  const explanation = explanations[key];

  if (explanation) {
    return simple ? explanation.simple : explanation.detailed;
  }

  // Fallback: extract explanation from search results
  const snippet = results[0]?.snippet || '';
  const sentences = snippet.split('.').slice(0, 2);
  return sentences.join('.') + '.';
}

function generateCodeExamples(query: string): string {
  const examples: { [key: string]: string } = {
    usestate: `
\`\`\`javascript
// Basic useState example
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\``,

    useeffect: `
\`\`\`javascript
// Basic useEffect example
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\``,

    component: `
\`\`\`javascript
// Functional component example
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Sara" />
\`\`\``,
  };

  return (
    examples[query.toLowerCase()] ||
    'No code examples available for this topic.'
  );
}
