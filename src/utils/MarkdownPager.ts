import chalk from 'chalk';
import { createInterface } from 'readline';

export class MarkdownPager {
  private lines: string[] = [];
  private currentLine = 0;
  private pageSize = 20;

  constructor(content: string, pageSize = 20) {
    this.pageSize = pageSize;
    this.lines = this.formatMarkdown(content).split('\n');
  }

  async display(): Promise<void> {
    console.clear();
    this.showHeader();

    while (this.currentLine < this.lines.length) {
      this.showPage();

      if (this.currentLine + this.pageSize >= this.lines.length) {
        console.log(chalk.gray('\n(End) Press any key to exit...'));
        await this.waitForKey();
        break;
      }

      const action = await this.promptUser();

      switch (action) {
        case 'q':
        case 'quit':
          return;
        case 'j': // Vim: down
        case 'n':
        case 'next':
        case '':
          this.currentLine += this.pageSize;
          break;
        case 'k': // Vim: up
        case 'p':
        case 'prev':
          this.currentLine = Math.max(0, this.currentLine - this.pageSize);
          break;
        case 'h': // Vim: left / help
        case 'help':
        case '?':
          this.showHelp();
          await this.waitForKey();
          break;
        case 'l': // Vim: right (same as down for pager)
          this.currentLine += this.pageSize;
          break;
        case 'g': // Vim: go to top
          this.currentLine = 0;
          break;
        case 'G': // Vim: go to bottom
          this.currentLine = Math.max(0, this.lines.length - this.pageSize);
          break;
        case 'd': // Vim: half page down
          this.currentLine += Math.floor(this.pageSize / 2);
          break;
        case 'u': // Vim: half page up
          this.currentLine = Math.max(
            0,
            this.currentLine - Math.floor(this.pageSize / 2)
          );
          break;
        case 'f': // Vim: full page forward
        case ' ': // Space: page down
          this.currentLine += this.pageSize;
          break;
        case 'b': // Vim: full page back
          this.currentLine = Math.max(0, this.currentLine - this.pageSize);
          break;
        default:
          // Try to parse as line number
          const lineNum = parseInt(action);
          if (!isNaN(lineNum) && lineNum > 0) {
            this.currentLine = Math.max(
              0,
              Math.min(lineNum - 1, this.lines.length - this.pageSize)
            );
          }
      }
      console.clear();
      this.showHeader();
    }
  }

  private formatMarkdown(content: string): string {
    return (
      content
        // Headers with colored backgrounds
        .replace(/^# (.+)$/gm, chalk.bgBlue.white.bold(' $1 '))
        .replace(/^## (.+)$/gm, chalk.bgCyan.black.bold(' $1 '))
        .replace(/^### (.+)$/gm, chalk.bgGreen.black.bold(' $1 '))
        .replace(/^#### (.+)$/gm, chalk.bgYellow.black.bold(' $1 '))

        // Text formatting
        .replace(/\*\*(.+?)\*\*/g, chalk.bold.white('$1'))
        .replace(/\*(.+?)\*/g, chalk.italic.gray('$1'))
        .replace(/_(.+?)_/g, chalk.underline('$1'))

        // Code formatting
        .replace(/`([^`]+)`/g, chalk.bgGray.black(' $1 '))
        .replace(/^```(\w*)?$/gm, chalk.gray('┌─ Code Block ─┐'))
        .replace(/^```$/gm, chalk.gray('└───────────────┘'))

        // Lists and quotes
        .replace(/^> (.+)$/gm, chalk.blue('▌ ') + chalk.italic.gray('$1'))
        .replace(/^- (.+)$/gm, chalk.cyan('  • ') + chalk.white('$1'))
        .replace(/^\* (.+)$/gm, chalk.cyan('  • ') + chalk.white('$1'))
        .replace(/^\+ (.+)$/gm, chalk.cyan('  • ') + chalk.white('$1'))
        .replace(/^\d+\. (.+)$/gm, (match, text, offset, string) => {
          const lineStart = string.lastIndexOf('\n', offset) + 1;
          const lineText = string.substring(lineStart, offset);
          const num = lineText.match(/^(\d+)\./)?.[1] || '1';
          return chalk.magenta(`  ${num}. `) + chalk.white(text);
        })

        // Links (simplified)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, chalk.blue.underline('$1'))

        // Horizontal rules
        .replace(/^---+$/gm, chalk.gray('─'.repeat(50)))
        .replace(/^===+$/gm, chalk.gray('═'.repeat(50)))
    );
  }

  private showHeader(): void {
    const progress = `${this.currentLine + 1}-${Math.min(this.currentLine + this.pageSize, this.lines.length)} of ${this.lines.length}`;
    console.log(chalk.inverse(` Documentation Viewer (${progress}) `));
    console.log(
      chalk.gray(
        'Vim keys: [j/k] up/down, [h/?] help, [g/G] top/bottom, [d/u] half page, [f/b] full page, [q] quit\n'
      )
    );
  }

  private showPage(): void {
    const endLine = Math.min(
      this.currentLine + this.pageSize,
      this.lines.length
    );

    for (let i = this.currentLine; i < endLine; i++) {
      const lineNum = chalk.gray(`${(i + 1).toString().padStart(3)} │ `);
      console.log(lineNum + this.lines[i]);
    }
  }

  private showHelp(): void {
    console.log(
      chalk.bold.yellow('\n📚 Documentation Viewer - Vim-Style Navigation:\n')
    );
    console.log(chalk.white('  j, n, Enter     - Move down one page'));
    console.log(chalk.white('  k, p           - Move up one page'));
    console.log(chalk.white('  h, ?           - Show this help'));
    console.log(
      chalk.white('  l              - Move down one page (vim right)')
    );
    console.log(chalk.white('  g              - Go to top'));
    console.log(chalk.white('  G              - Go to bottom'));
    console.log(chalk.white('  d              - Half page down'));
    console.log(chalk.white('  u              - Half page up'));
    console.log(chalk.white('  f, Space       - Full page forward'));
    console.log(chalk.white('  b              - Full page back'));
    console.log(chalk.white('  q, quit        - Exit viewer'));
    console.log(chalk.white('  <number>       - Go to specific line number'));
    console.log(chalk.gray('\nPress any key to continue...'));
  }

  private async promptUser(): Promise<string> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(chalk.cyan('> '), (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase());
      });
    });
  }

  private async waitForKey(): Promise<void> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('', () => {
        rl.close();
        resolve();
      });
    });
  }
}
