#!/usr/bin/env node

import { Command } from 'commander';
import { fetchCommand } from '../src/cli/fetch';
import { searchCommand } from '../src/cli/search';
import { listCommand } from '../src/cli/list';
import { removeCommand } from '../src/cli/remove';
import { setupAvailableCommand } from '../src/cli/available';
import { interactiveCommand } from '../src/cli/interactive';
import { exportCommand } from '../src/cli/export';
import { explainCommand } from '../src/cli/explain';
import { quickCommand } from '../src/cli/quick';
import { copyCommand } from '../src/cli/copy';
import { updateCommand } from '../src/cli/update';

const program = new Command();

program
  .name('docu')
  .description(
    'Blazing-fast, offline-first CLI to fetch, cache, and search developer docs'
  )
  .version('0.2.0');

// Core commands
program.addCommand(fetchCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(removeCommand);
program.addCommand(updateCommand);

// Enhanced commands
program.addCommand(interactiveCommand);
program.addCommand(exportCommand);
setupAvailableCommand(program);

// Developer productivity commands
program.addCommand(explainCommand);
program.addCommand(quickCommand);
program.addCommand(copyCommand);

// Parse arguments
program.parse(process.argv);
