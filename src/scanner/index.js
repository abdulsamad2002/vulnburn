import { findFiles } from '../utils/file-walker.js';
import { SecretsScanner } from './secrets-scanner.js';
import { CodeScanner } from './code-scanner.js';
import { CryptoScanner } from './crypto-scanner.js';
import { getRoast } from '../roasts/matcher.js';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

export async function runScanner(directory, options = {}) {
    const spinner = ora('Scanning for questionable life choices...').start();

    try {
        const files = await findFiles(directory);

        if (files.length === 0) {
            spinner.fail("No files found to scan. Are you sure you're in the right directory?");
            return;
        }

        const secretsScanner = new SecretsScanner();
        const codeScanner = new CodeScanner();
        const cryptoScanner = new CryptoScanner();

        let allIssues = [];

        for (const file of files) {
            const fileData = {
                path: file.path,
                content: file.content
            };

            const secrets = secretsScanner.scan(fileData);
            const codeIssues = codeScanner.scan(fileData);
            const cryptoIssues = cryptoScanner.scan(fileData);

            const fileIssues = [...secrets, ...codeIssues, ...cryptoIssues].map(issue => ({
                ...issue,
                file: file.path,
                roast: getRoast(issue)
            }));

            allIssues = [...allIssues, ...fileIssues];
        }

        spinner.succeed('Scan complete. Prepare to be roasted.');

        const stats = {
            total: allIssues.length,
            by_severity: {
                critical: allIssues.filter(i => i.severity === 'critical').length,
                high: allIssues.filter(i => i.severity === 'high').length,
                medium: allIssues.filter(i => i.severity === 'medium').length,
                low: allIssues.filter(i => i.severity === 'low').length,
            },
            by_type: {}
        };

        allIssues.forEach(issue => {
            const typeKey = issue.type || 'unknown';
            stats.by_type[typeKey] = (stats.by_type[typeKey] || 0) + 1;
        });

        if (allIssues.length > 0) {
            console.log(chalk.bold.underline(`\nFound ${stats.total} total failures.`));

            // Nice summary box
            console.log(chalk.red(`  Critical: ${stats.by_severity.critical}`) +
                chalk.yellow(`  High: ${stats.by_severity.high}`) +
                chalk.blue(`  Medium: ${stats.by_severity.medium}`) +
                chalk.gray(`  Low: ${stats.by_severity.low}`));

            if (options.verbose) {
                console.log(JSON.stringify(allIssues, null, 2));
            } else {
                allIssues.forEach((issue, i) => {
                    const color = issue.severity === 'critical' ? chalk.red :
                        issue.severity === 'high' ? chalk.magenta :
                            issue.severity === 'medium' ? chalk.yellow : chalk.blue;

                    const icon = issue.severity === 'critical' ? '🛑' :
                        issue.severity === 'high' ? '🔥' :
                            issue.severity === 'medium' ? '⚠️' : 'ℹ️';

                    console.log(`\n${icon} #${i + 1}: ${color.bold(issue.description)}`);
                    console.log(chalk.white.italic(`   "${issue.roast}"`));
                    console.log(chalk.dim(`   📍 ${issue.file}:${issue.line}`));
                    if (issue.snippet) {
                        console.log(chalk.cyan(`   💻 Code: ${issue.snippet.trim().substring(0, 100)}`));
                    }
                });
            }

            console.log('\n' + chalk.bgRed.white.bold(' FINAL VERDICT ') + ' ' + chalk.red('Build Failed. Fix your code.'));
            process.exit(1);
        } else {
            console.log(chalk.green('\n✅ Surprisingly, no issues found. Did you even write any code?'));
            process.exit(0);
        }

    } catch (error) {
        spinner.fail('Scanner crashed. Probably your fault (or ours, but mostly yours).');
        console.error(error);
        process.exit(1);
    }
}
