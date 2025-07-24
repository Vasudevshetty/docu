import chalk from 'chalk';

export class MarkdownPager {
  private lines: string[] = [];
  private currentLine = 0;
  private pageSize = 20;

  constructor(content: string, pageSize = 20) {
    this.pageSize = Math.min(pageSize, process.stdout.rows - 3); // Account for header/footer
    this.lines = this.formatMarkdown(content).split('\n');
  }

  async display(): Promise<void> {
    // Enable raw mode for immediate key handling
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }

    console.clear();
    this.showPage();

    return new Promise((resolve) => {
      const onKey = (key: Buffer) => {
        const keyStr = key.toString();

        switch (keyStr) {
          case 'q':
          case '\u0003': // Ctrl+C
          case '\u001b': // ESC
            this.cleanup();
            resolve();
            return;

          case 'j': // Vim: down
          case ' ': // Space: page down
          case '\r': // Enter
            this.scrollDown();
            break;

          case 'k': // Vim: up
          case 'b': // Back one page
            this.scrollUp();
            break;

          case 'd': // Vim: half page down
            this.scrollDown(Math.floor(this.pageSize / 2));
            break;

          case 'u': // Vim: half page up
            this.scrollUp(Math.floor(this.pageSize / 2));
            break;

          case 'g': // Vim: go to top
            this.currentLine = 0;
            break;

          case 'G': // Vim: go to bottom
            this.currentLine = Math.max(0, this.lines.length - this.pageSize);
            break;

          case 'f': // Vim: page forward
            this.scrollDown();
            break;

          case 'h': // Vim: help
          case '?':
            this.showHelp();
            return; // Don't refresh page after help

          default:
            // Ignore other keys
            return;
        }

        this.showPage();

        // Auto-exit if at end and trying to go down
        if (
          this.currentLine >= this.lines.length - this.pageSize &&
          (keyStr === 'j' || keyStr === ' ' || keyStr === '\r')
        ) {
          setTimeout(() => {
            this.cleanup();
            resolve();
          }, 500);
        }
      };

      process.stdin.on('data', onKey);

      // Cleanup function
      const cleanup = () => {
        process.stdin.removeListener('data', onKey);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
          process.stdin.pause();
        }
      };

      // Store cleanup for later use
      this.cleanup = cleanup;
    });
  }

  private cleanup = () => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }
    console.log(); // Add newline before exit
  };

  private scrollDown(lines = this.pageSize): void {
    this.currentLine = Math.min(
      this.lines.length - this.pageSize,
      this.currentLine + lines
    );
  }

  private scrollUp(lines = this.pageSize): void {
    this.currentLine = Math.max(0, this.currentLine - lines);
  }

  private showPage(): void {
    console.clear();
    this.showHeader();

    const endLine = Math.min(
      this.currentLine + this.pageSize,
      this.lines.length
    );

    for (let i = this.currentLine; i < endLine; i++) {
      console.log(this.lines[i]);
    }

    this.showFooter();
  }

  private showHeader(): void {
    const progress = Math.floor((this.currentLine / this.lines.length) * 100);
    const position = `${this.currentLine + 1}-${Math.min(this.currentLine + this.pageSize, this.lines.length)} of ${this.lines.length}`;

    console.log(
      chalk.blue.bold('📖 Documentation Viewer') +
        chalk.gray(` | ${position} (${progress}%)`)
    );
    console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  }

  private showFooter(): void {
    console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));

    if (this.currentLine + this.pageSize >= this.lines.length) {
      console.log(chalk.yellow('(END) ') + chalk.gray('Press q to quit'));
    } else {
      console.log(
        chalk.gray('j/↓:down k/↑:up d:½down u:½up g:top G:end h:help q:quit')
      );
    }
  }

  private async showHelp(): Promise<void> {
    console.clear();
    console.log(chalk.blue.bold('📖 Documentation Viewer - Help\n'));

    const helpText = [
      chalk.yellow('Navigation:'),
      '  j, ↓, Space, Enter  - Scroll down',
      '  k, ↑, b            - Scroll up',
      '  d                  - Half page down',
      '  u                  - Half page up',
      '  g                  - Go to top',
      '  G                  - Go to bottom',
      '  f                  - Page forward',
      '',
      chalk.yellow('Actions:'),
      '  h, ?               - Show this help',
      '  q, Esc, Ctrl+C     - Quit',
      '',
      chalk.gray('Press any key to continue...'),
    ];

    helpText.forEach((line) => console.log(line));

    // Wait for any key press
    return new Promise<void>((resolve) => {
      const onKey = () => {
        process.stdin.removeListener('data', onKey);
        this.showPage();
        resolve();
      };
      process.stdin.once('data', onKey);
    });
  }

  public formatMarkdown(content: string): string {
    let formatted = content;

    // Headers with colors
    formatted = formatted.replace(/^# (.+)$/gm, chalk.blue.bold('# $1'));
    formatted = formatted.replace(/^## (.+)$/gm, chalk.green.bold('## $1'));
    formatted = formatted.replace(/^### (.+)$/gm, chalk.yellow.bold('### $1'));
    formatted = formatted.replace(/^#### (.+)$/gm, chalk.cyan.bold('#### $1'));

    // Bold text
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, chalk.bold('$1'));

    // Italic text
    formatted = formatted.replace(/\*(.+?)\*/g, chalk.italic('$1'));

    // Code blocks
    formatted = formatted.replace(/```[\s\S]*?```/g, (match) =>
      chalk.bgGray.black(match.replace(/```/g, ''))
    );

    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, chalk.bgBlack.white(' $1 '));

    // Links
    formatted = formatted.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      chalk.blue.underline('$1') + chalk.gray(' ($2)')
    );

    // Lists
    formatted = formatted.replace(/^[*-] (.+)$/gm, chalk.cyan('• ') + '$1');
    formatted = formatted.replace(
      /^\d+\. (.+)$/gm,
      (match, text, offset, string) => {
        const lineStart = string.lastIndexOf('\n', offset) + 1;
        const number = match.match(/^(\d+)\./)?.[1] || '1';
        return chalk.cyan(`${number}. `) + text;
      }
    );

    // Quotes
    formatted = formatted.replace(
      /^> (.+)$/gm,
      chalk.gray('│ ') + chalk.italic('$1')
    );

    return formatted;
  }
}
