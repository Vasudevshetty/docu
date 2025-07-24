import chalk from 'chalk';

export class Banner {
  static getAsciiArt(version: string = '0.3.4'): string {
    return `
    ███████╗  ██████╗  ██████╗ ██╗   ██╗
    ██╔═══██╗██╔═══██╗██╔════╝ ██║   ██║
    ██║   ██║██║   ██║██║      ██║   ██║
    ██║   ██║██║   ██║██║      ██║   ██║
    ███████╔╝╚██████╔╝╚██████║ ╚██████╔╝
     ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ 

    docu v${version}
    by Vasudevshetty • github.com/Vasudevshetty/docu
    `;
  }

  static show(version: string = '0.3.4'): void {
    console.log();
    console.log(chalk.cyan.bold(Banner.getAsciiArt(version)));
    console.log();
  }

  static showSmall(version: string = '0.3.4'): void {
    console.log(
      chalk.cyan.bold(`docu v${version}`) + chalk.gray(' by Vasudev Shetty')
    );
  }

  static showVersion(version: string): void {
    Banner.show(version);
  }
}
