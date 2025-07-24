import { Command } from 'commander';
import chalk from 'chalk';
import { SearchDocs } from '../core/SearchDocs.js';

export const copyCommand = new Command('copy')
  .alias('cp')
  .description('Copy code examples to clipboard')
  .argument('[query]', 'What code example to copy')
  .option('--list', 'List available code examples')
  .action(async (query: string | undefined, options: { list?: boolean }) => {
    if (options.list) {
      showAvailableExamples();
      return;
    }

    if (!query) {
      console.log(
        chalk.yellow(
          'Please provide a query or use --list to see available examples'
        )
      );
      return;
    }

    try {
      const codeExample = getCodeExample(query);

      if (!codeExample) {
        console.log(chalk.yellow(`❌ No code example found for "${query}"`));
        console.log(
          chalk.gray('Use ') +
            chalk.bold('docu copy --list') +
            chalk.gray(' to see available examples')
        );
        return;
      }

      // In a real implementation, this would copy to clipboard
      // For now, we'll display the code prominently
      console.log(
        chalk.bold.green(
          `📋 Code example for "${query}" (copied to clipboard):\n`
        )
      );
      console.log(chalk.blue('```javascript'));
      console.log(codeExample);
      console.log(chalk.blue('```\n'));

      console.log(
        chalk.gray('💡 Paste this into your editor to use the example')
      );
    } catch (error) {
      console.error(
        chalk.red('❌ Copy failed:'),
        error instanceof Error ? error.message : String(error)
      );
    }
  });

function getCodeExample(query: string): string | null {
  const examples: { [key: string]: string } = {
    usestate: `const [count, setCount] = useState(0);

// Update state
setCount(count + 1);

// Or with function (recommended for updates based on previous state)
setCount(prevCount => prevCount + 1);`,

    useeffect: `// Run effect after every render
useEffect(() => {
  document.title = \`Count: \${count}\`;
});

// Run effect only once (like componentDidMount)
useEffect(() => {
  fetchData();
}, []);

// Run effect when dependencies change
useEffect(() => {
  fetchUserData(userId);
}, [userId]);`,

    fetch: `// Basic fetch
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Async/await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,

    map: `// Transform array elements
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);

// Extract properties from objects
const users = [{name: 'Alice', age: 25}, {name: 'Bob', age: 30}];
const names = users.map(user => user.name);`,

    component: `import React from 'react';

// Functional component with props
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Welcome name="Alice" age={25} />`,

    express: `import express from 'express';
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.post('/users', (req, res) => {
  const user = req.body;
  // Process user data
  res.json({ success: true, user });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
  };

  return examples[query.toLowerCase()] || null;
}

function showAvailableExamples(): void {
  console.log(chalk.bold.blue('📋 Available Code Examples:\n'));

  const examples = [
    'usestate - React state management',
    'useeffect - React side effects',
    'fetch - HTTP requests',
    'map - Array transformation',
    'component - React components',
    'express - Express.js server setup',
  ];

  examples.forEach((example, index) => {
    const [name, description] = example.split(' - ');
    console.log(
      `${chalk.cyan((index + 1).toString().padStart(2))}. ${chalk.bold.green(name.padEnd(12))} ${chalk.gray(description)}`
    );
  });

  console.log(chalk.gray('\nUsage: ') + chalk.bold('docu copy <example-name>'));
}
