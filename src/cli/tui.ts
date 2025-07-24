import { Command } from 'commander';
import React from 'react';
import App from '../tui/App.js';
import {render} from 'ink';

export const tuiCommand = new Command()
  .name('tui')
  .alias('ui')
  .description('Launch the Terminal User Interface (TUI) for docu-cli')
  .action(async () => {
    try {
      // Clear the screen for a clean start
      process.stdout.write('\x1b[2J\x1b[0f');

      // Dynamically import Ink for ESM compatibility
      const { waitUntilExit } = render(React.createElement(App));

      // Wait for the app to exit
      await waitUntilExit();
    } catch (error) {
      console.error('TUI Error:', error);
      process.exit(1);
    }
  });
