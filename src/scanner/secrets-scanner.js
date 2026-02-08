export function scanForSecrets(content) {
    const issues = [];
    const lines = content.split('\n');

    // Regex for potential API keys
    const regex = /(".*[a-zA-Z0-9]{32,}.*")|('''.*[a-zA-Z0-9]{32,}.*''')/g;

    lines.forEach((line, index) => {
        if (regex.test(line) && !line.includes('eslint-disable')) {
            // Very basic heuristic
            issues.push({
                type: 'Hardcoded Secret',
                line: index + 1,
                snippet: line.trim(),
                id: 'hardcoded-secret',
                roast: "Did you just commit your API key? Might as well post it on Twitter and save us the trouble."
            });
        }
    });

    return issues;
}
