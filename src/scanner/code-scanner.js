export function scanCode(content) {
    const issues = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        if (line.includes('eval(')) {
            issues.push({
                type: 'Dangerous Eval',
                line: index + 1,
                snippet: line.trim(),
                id: 'eval-usage',
                roast: "Using eval() is like giving a hacker the keys to your car and asking them to drive safely."
            });
        }

        if (line.includes('console.log(')) {
            issues.push({
                type: 'Console Log Cleanup',
                line: index + 1,
                snippet: line.trim(),
                id: 'console-log',
                roast: "console.log in production? Very professional. I bet you debug on live servers too."
            });
        }
    });

    return issues;
}
