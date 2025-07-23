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
        case 'n':
        case 'next':
        case '':
          this.currentLine += this.pageSize;
          break;
        case 'p':
        case 'prev':
          this.currentLine = Math.max(0, this.currentLine - this.pageSize);
          break;
        case 'h':
        case 'help':
          this.showHelp();
          await this.waitForKey();
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
    return content
      .replace(/^# (.+)$/gm, chalk.bold.blue('$1'))
      .replace(/^## (.+)$/gm, chalk.bold.cyan('$1'))
      .replace(/^### (.+)$/gm, chalk.bold.green('$1'))
      .replace(/\*\*(.+?)\*\*/g, chalk.bold('$1'))
      .replace(/\*(.+?)\*/g, chalk.italic('$1'))
      .replace(/`(.+?)`/g, chalk.bgGray.white(' $1 '))
      .replace(/^```/gm, chalk.gray('```'))
      .replace(/^> (.+)$/gm, chalk.yellow('│ $1'))
      .replace(/^• (.+)$/gm, chalk.white('  • $1'));
  }

  private showHeader(): void {
    const progress = `${this.currentLine + 1}-${Math.min(this.currentLine + this.pageSize, this.lines.length)} of ${this.lines.length}`;
    console.log(chalk.inverse(` Documentation Viewer (${progress}) `));
    console.log(
      chalk.gray(
        'Commands: [Enter/n] next, [p] prev, [q] quit, [h] help, [number] go to line\n'
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
    console.log(chalk.bold.yellow('\n📚 Documentation Viewer Help:\n'));
    console.log(chalk.white('  Enter, n, next  - Show next page'));
    console.log(chalk.white('  p, prev        - Show previous page'));
    console.log(chalk.white('  q, quit        - Exit viewer'));
    console.log(chalk.white('  h, help        - Show this help'));
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
