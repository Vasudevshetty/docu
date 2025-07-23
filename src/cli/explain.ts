import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs';

export const explainCommand = new Command('explain')
  .description('Get AI-powered explanations and code examples')
  .argument('<query>', 'What to explain (e.g., "useState", "useEffect")')
  .option('-d, --docset <docset>', 'Limit search to specific docset')
  .option('--examples', 'Include code examples')
  .option('--simple', 'Simple explanation for beginners')
  .action(
    async (
      query: string,
      options: {
        docset?: string;
        examples?: boolean;
        simple?: boolean;
      }
    ) => {
      try {
        console.log(chalk.blue(`🤖 Explaining "${query}"...\n`));

        // First, search for relevant documentation
        const searcher = new SearchDocs();
        const results = await searcher.search(query, {
          docset: options.docset,
          limit: 3,
        });

        if (results.length === 0) {
          console.log(chalk.yellow(`No documentation found for "${query}"`));
          console.log(
            chalk.gray('Try fetching more docsets or check spelling.')
          );
          return;
        }

        // Generate AI explanation (placeholder for now)
        console.log(chalk.bold.green('📚 Quick Explanation:'));
        console.log(generateExplanation(query, results, options.simple));

        if (options.examples) {
          console.log(chalk.bold.blue('\n💻 Code Examples:'));
          console.log(generateCodeExamples(query));
        }

        console.log(chalk.bold.cyan('\n🔗 Related Documentation:'));
        results.slice(0, 2).forEach((result, index) => {
          console.log(chalk.gray(`${index + 1}. ${result.title}`));
          console.log(chalk.blue(`   ${result.url}`));
        });

        console.log(
          chalk.gray('\n💡 Use ') +
            chalk.bold('docu search <term>') +
            chalk.gray(' for more detailed results')
        );
      } catch (error) {
        console.error(
          chalk.red('❌ Explanation failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );

function generateExplanation(
  query: string,
  results: any[],
  simple?: boolean
): string {
  // This would integrate with an LLM API (OpenAI, Anthropic, etc.)
  // For now, providing rule-based explanations

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
    return chalk.white(simple ? explanation.simple : explanation.detailed);
  }

  // Fallback: extract explanation from search results
  const snippet = results[0]?.snippet || '';
  const sentences = snippet.split('.').slice(0, 2);
  return chalk.white(sentences.join('.') + '.');
}

function generateCodeExamples(query: string): string {
  const examples: { [key: string]: string } = {
    usestate: `
${chalk.gray('// Basic useState example')}
${chalk.green("import React, { useState } from 'react';")}

${chalk.green('function Counter() {')}
${chalk.green('  const [count, setCount] = useState(0);')}
${chalk.green('')}
${chalk.green('  return (')}
${chalk.green('    <div>')}
${chalk.green('      <p>You clicked {count} times</p>')}
${chalk.green('      <button onClick={() => setCount(count + 1)}>')}
${chalk.green('        Click me')}
${chalk.green('      </button>')}
${chalk.green('    </div>')}
${chalk.green('  );')}
${chalk.green('}')}`,

    useeffect: `
${chalk.gray('// Basic useEffect example')}
${chalk.green("import React, { useState, useEffect } from 'react';")}

${chalk.green('function Example() {')}
${chalk.green('  const [count, setCount] = useState(0);')}
${chalk.green('')}
${chalk.green('  useEffect(() => {')}
${chalk.green('    document.title = `You clicked ${count} times`;')}
${chalk.green('  });')}
${chalk.green('')}
${chalk.green('  return (')}
${chalk.green('    <div>')}
${chalk.green('      <p>You clicked {count} times</p>')}
${chalk.green('      <button onClick={() => setCount(count + 1)}>')}
${chalk.green('        Click me')}
${chalk.green('      </button>')}
${chalk.green('    </div>')}
${chalk.green('  );')}
${chalk.green('}')}`,

    component: `
${chalk.gray('// Functional component example')}
${chalk.green('function Welcome(props) {')}
${chalk.green('  return <h1>Hello, {props.name}!</h1>;')}
${chalk.green('}')}
${chalk.green('')}
${chalk.gray('// Usage')}
${chalk.green('<Welcome name="Sara" />')}`,
  };

  return (
    examples[query.toLowerCase()] ||
    chalk.gray('No code examples available for this topic.')
  );
}
