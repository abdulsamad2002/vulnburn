#!/usr/bin/env node

import { Command } from 'commander';
import { runScanner } from '../src/scanner/index.js';
import chalk from 'chalk';

const program = new Command();

program
  .name('vulnburn')
  .description('A security scanner with an attitude')
  .version('1.0.0')
  .argument('[directory]', 'directory to scan', '.')
  .option('-v, --verbose', 'show detailed scan output')
  .action((directory, options) => {
    console.log(chalk.bold.red('🔥 VULNBURN ACTIVATED 🔥'));
    console.log(chalk.dim(`Target locked: ${directory}`));
    runScanner(directory, options);
  });

program.parse();
