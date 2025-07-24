import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface GroqConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export class GroqService {
  private groq: Groq;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: GroqConfig) {
    if (!config.apiKey) {
      throw new Error(
        'GROQ_API_KEY is required. Please set it in your .env file.'
      );
    }

    this.groq = new Groq({
      apiKey: config.apiKey,
    });

    this.model = config.model || 'llama3-8b-8192';
    this.maxTokens = config.maxTokens || 1024;
    this.temperature = config.temperature || 0.1;
  }

  static fromEnv(): GroqService {
    // Try to load from home directory first, then local .env
    const homePath = path.join(os.homedir(), '.docu', '.env');
    const localPath = '.env';

    // Load home config if exists
    if (fs.existsSync(homePath)) {
      dotenv.config({ path: homePath });
    } else {
      // Fallback to local .env
      dotenv.config({ path: localPath });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error(
        chalk.red('❌ GROQ_API_KEY not configured.\n') +
          chalk.yellow('Run `docu setup` to configure your API key, or\n') +
          chalk.yellow('Get your API key from: https://console.groq.com/\n') +
          chalk.gray('Then run: docu setup --groq-key YOUR_API_KEY')
      );
    }

    return new GroqService({
      apiKey,
      model: process.env.GROQ_MODEL || 'llama3-8b-8192',
      maxTokens: parseInt(process.env.GROQ_MAX_TOKENS || '1024'),
      temperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.1'),
    });
  }

  async explainCode(code: string, context: string = ''): Promise<string> {
    const prompt = `You are a helpful programming assistant. Explain the following code in a clear, concise way.

${context ? `Context: ${context}\n` : ''}
Code to explain:
\`\`\`
${code}
\`\`\`

Provide a clear explanation that covers:
1. What this code does
2. Key concepts or patterns used
3. Any important details or gotchas
4. When you might use this approach

Keep the explanation concise but thorough.`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      return (
        response.choices[0]?.message?.content || 'No explanation generated.'
      );
    } catch (error) {
      throw new Error(
        `Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateQuickReference(
    topic: string,
    framework?: string
  ): Promise<string> {
    const prompt = `Generate a quick reference guide for "${topic}"${framework ? ` in ${framework}` : ''}. 

Include:
- Common syntax patterns
- Most frequently used methods/properties
- Simple code examples
- Best practices or gotchas

Format as clean markdown. Keep it concise but practical for quick lookup.`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      return response.choices[0]?.message?.content || 'No reference generated.';
    } catch (error) {
      throw new Error(
        `Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async enhanceSearchResults(query: string, results: any[]): Promise<string> {
    const resultsText = results
      .map((r) => `${r.title}: ${r.content || r.snippet}`)
      .join('\n\n');

    const prompt = `Based on the search query "${query}" and the following documentation results, provide a helpful summary and guidance.

Search Results:
${resultsText}

Please provide:
1. A brief summary of what the user is looking for
2. Key points from the search results
3. Practical guidance or next steps
4. Related concepts they might want to explore

Keep it concise and actionable.`;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.model,
        max_tokens: Math.min(this.maxTokens, 512), // Shorter for summaries
        temperature: this.temperature,
      });

      return response.choices[0]?.message?.content || 'No summary generated.';
    } catch (error) {
      throw new Error(
        `Groq API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: 'Test' }],
        model: this.model,
        max_tokens: 1,
      });
      return true;
    } catch {
      return false;
    }
  }
}
