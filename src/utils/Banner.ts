import chalk from 'chalk';

export class Banner {
  static getAsciiArt(): string {
    return `     ____   ____   ____  _   _ 
    |  _ \\ / ___| / ___|| | | |
    | | | | |    | |    | | | |
    | |_| | |___ | |___ | |_| |
    |____/ \\____| \\____| \\___/ 

    📚 AI-Powered Offline Documentation CLI
    by @vasudevshetty • github.com/Vasudevshetty/docu`;
  }

  static show(): void {
    console.log();
    console.log(chalk.cyan.bold('     ____   ____   ____  _   _ '));
    console.log(chalk.cyan.bold('    |  _ \\ / ___| / ___|| | | |'));
    console.log(chalk.cyan.bold('    | | | | |    | |    | | | |'));
    console.log(chalk.cyan.bold('    | |_| | |___ | |___ | |_| |'));
    console.log(chalk.cyan.bold('    |____/ \\____| \\____| \\___/ '));
    console.log();
    console.log(chalk.blue.bold('    📚 AI-Powered Offline Documentation CLI'));
    console.log(
      chalk.gray('    by @vasudevshetty • github.com/Vasudevshetty/docu')
    );
    console.log();
  }

  static showSmall(): void {
    console.log(
      chalk.cyan.bold('📚 docu-cli') + chalk.gray(' by @vasudevshetty')
    );
  }

  static showVersion(version: string): void {
    console.log();
    console.log(chalk.cyan.bold('📚 docu-cli') + chalk.gray(` v${version}`));
    console.log(chalk.gray('AI-Powered Offline Documentation CLI'));
    console.log(
      chalk.gray('by @vasudevshetty • https://github.com/Vasudevshetty/docu')
    );
    console.log();
  }
}
