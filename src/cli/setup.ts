import { Command } from 'commander';
import chalk from 'chalk';
import { createInterface } from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const setupCommand = new Command('setup')
  .description('Setup docu-cli with API keys and configuration')
  .option('--groq-key <key>', 'Set Groq API key directly')
  .option('--show-config', 'Show current configuration')
  .option('--reset', 'Reset configuration to defaults')
  .action(
    async (options: {
      groqKey?: string;
      showConfig?: boolean;
      reset?: boolean;
    }) => {
      try {
        const configDir = path.join(os.homedir(), '.docu');
        const configFile = path.join(configDir, '.env');

        if (options.reset) {
          await resetConfig(configFile);
          return;
        }

        if (options.showConfig) {
          await showConfig(configFile);
          return;
        }

        console.log(chalk.bold.blue('🚀 Welcome to docu-cli setup!\n'));

        // Ensure config directory exists
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }

        let groqKey = options.groqKey;

        if (!groqKey) {
          console.log(chalk.cyan('🤖 AI Features Setup (Optional)'));
          console.log(
            chalk.gray(
              'Get your free API key from: https://console.groq.com/\n'
            )
          );

          groqKey = await askQuestion(
            'Enter your Groq API key (or press Enter to skip): '
          );
        }

        // Create or update .env file
        const envContent = await createEnvContent(configFile, groqKey);
        fs.writeFileSync(configFile, envContent);

        console.log(chalk.green('\n✅ Configuration saved!'));
        console.log(chalk.gray(`📁 Config location: ${configFile}`));

        if (groqKey) {
          console.log(chalk.blue('\n🤖 AI features enabled! You can now use:'));
          console.log(chalk.gray('  • docu search "query" --ai'));
          console.log(chalk.gray('  • docu explain "concept" --simple'));
          console.log(chalk.gray('  • docu quick "syntax" --ai'));
        } else {
          console.log(
            chalk.yellow('\n⚠️  AI features disabled (no API key provided)')
          );
          console.log(
            chalk.gray(
              'You can add it later with: docu setup --groq-key YOUR_KEY'
            )
          );
        }

        console.log(chalk.green('\n🎯 Ready to use docu-cli!'));
        console.log(
          chalk.gray('Try: docu fetch react && docu search "useState"')
        );
      } catch (error) {
        console.error(
          chalk.red('❌ Setup failed:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    }
  );

async function askQuestion(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function createEnvContent(
  configFile: string,
  groqKey?: string
): Promise<string> {
  let existingContent = '';

  if (fs.existsSync(configFile)) {
    existingContent = fs.readFileSync(configFile, 'utf8');
  }

  const lines = existingContent.split('\n');
  const updatedLines: string[] = [];
  let hasGroqKey = false;

  // Update existing lines or keep them
  for (const line of lines) {
    if (line.startsWith('GROQ_API_KEY=')) {
      if (groqKey) {
        updatedLines.push(`GROQ_API_KEY=${groqKey}`);
        hasGroqKey = true;
      }
    } else if (line.trim()) {
      updatedLines.push(line);
    }
  }

  // Add Groq key if not found and provided
  if (groqKey && !hasGroqKey) {
    updatedLines.push(`GROQ_API_KEY=${groqKey}`);
  }

  // Add default configuration if file is empty
  if (updatedLines.length === 0) {
    updatedLines.push('# docu-cli Configuration');
    updatedLines.push(
      '# Get your Groq API key from: https://console.groq.com/'
    );
    updatedLines.push('');
    if (groqKey) {
      updatedLines.push(`GROQ_API_KEY=${groqKey}`);
    } else {
      updatedLines.push('# GROQ_API_KEY=your_api_key_here');
    }
    updatedLines.push('');
    updatedLines.push('# Optional Groq Configuration');
    updatedLines.push('GROQ_MODEL=llama3-8b-8192');
    updatedLines.push('GROQ_MAX_TOKENS=1024');
    updatedLines.push('GROQ_TEMPERATURE=0.1');
  }

  return updatedLines.join('\n') + '\n';
}

async function showConfig(configFile: string): Promise<void> {
  console.log(chalk.bold.blue('📋 Current Configuration:\n'));

  if (!fs.existsSync(configFile)) {
    console.log(chalk.yellow('⚠️  No configuration found'));
    console.log(chalk.gray('Run `docu setup` to configure docu-cli'));
    return;
  }

  const content = fs.readFileSync(configFile, 'utf8');
  const lines = content.split('\n');

  console.log(chalk.gray(`📁 Config file: ${configFile}\n`));

  for (const line of lines) {
    if (line.startsWith('GROQ_API_KEY=')) {
      const key = line.split('=')[1];
      if (key && key !== 'your_api_key_here') {
        console.log(chalk.green('🤖 Groq AI: ✅ Configured'));
        console.log(chalk.gray(`   API Key: ${key.substring(0, 10)}...`));
      } else {
        console.log(chalk.yellow('🤖 Groq AI: ⚠️  Not configured'));
      }
    } else if (line.startsWith('GROQ_') && line.includes('=')) {
      const [key, value] = line.split('=');
      console.log(chalk.blue(`   ${key}: ${value}`));
    }
  }
}

async function resetConfig(configFile: string): Promise<void> {
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile);
    console.log(chalk.green('✅ Configuration reset'));
    console.log(chalk.gray('Run `docu setup` to reconfigure'));
  } else {
    console.log(chalk.yellow('⚠️  No configuration found to reset'));
  }
}
