import chalk from 'chalk';

export function report(issues) {
    if (issues.length === 0) {
        console.log(chalk.green('🔒 No glaringly obvious vulnerabilities found. But I\'m sure they\'re hiding.'));
        return;
    }

    console.log(chalk.underline.red(`Found ${issues.length} ways to ruin your career:`));
    issues.forEach((issue, index) => {
        console.log(`\n#${index + 1}: ${chalk.bold(issue.type)}`);
        console.log(chalk.yellow(issue.roast));
        console.log(chalk.dim(`  at ${issue.file}:${issue.line}`));
        console.log(chalk.cyan(`  Snippet: ${issue.snippet}`));
    });
}
