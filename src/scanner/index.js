import fs from 'fs/promises';
import { findFiles } from '../utils/file-walker.js';
import { scanForSecrets } from './secrets-scanner.js';
import { scanCode } from './code-scanner.js';
import { scanCrypto } from './crypto-scanner.js';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

export async function runScanner(directory) {
    const spinner = ora('Scanning for questionable life choices...').start();

    try {
        const files = await findFiles(directory);
        let allIssues = [];

        for (const file of files) {
            const fullPath = path.resolve(directory, file);
            const content = await fs.readFile(fullPath, 'utf-8');

            // Run specialized scanners
            const secrets = scanForSecrets(content);
            const codeIssues = scanCode(content);
            const cryptoIssues = scanCrypto(content);

            // Add context (filename) to issues
            const fileIssues = [...secrets, ...codeIssues, ...cryptoIssues].map(issue => ({
                ...issue,
                file: file
            }));

            allIssues = [...allIssues, ...fileIssues];
        }

        spinner.succeed('Scan complete. Prepare to be roasted.');

        if (allIssues.length > 0) {
            console.log(chalk.bold.underline(`Found ${allIssues.length} total failures.`));

            // Simple reporter locally here for now to avoid circular dependency complexity,
            // or import the reporter. Let's import the reporter.
            const { report } = await import('../reporter/terminal.js');
            report(allIssues);

            process.exit(1);
        } else {
            console.log(chalk.green('Surprisingly, no issues found. Did you even write any code?'));
            process.exit(0);
        }

    } catch (error) {
        spinner.fail('Scanner crashed. Probably your fault.');
        console.error(error);
        process.exit(1);
    }
}
