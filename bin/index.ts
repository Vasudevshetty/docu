#!/usr/bin/env node

import { Command } from 'commander';
import { fetchCommand } from '../src/cli/fetch';
import { searchCommand } from '../src/cli/search';
import { listCommand } from '../src/cli/list';
import { removeCommand } from '../src/cli/remove';
import { setupAvailableCommand } from '../src/cli/available';
import { interactiveCommand } from '../src/cli/interactive';
import { exportCommand } from '../src/cli/export';

const program = new Command();

program
  .name('docu')
  .description(
    'Blazing-fast, offline-first CLI to fetch, cache, and search developer docs'
  )
  .version('0.1.0');

// Register commands
program.addCommand(fetchCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(removeCommand);
program.addCommand(interactiveCommand);
program.addCommand(exportCommand);
setupAvailableCommand(program);

// Parse arguments
program.parse(process.argv);
