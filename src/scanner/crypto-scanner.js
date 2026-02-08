export function scanCrypto(content) {
    const issues = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        if (line.includes('md5(')) {
            issues.push({
                type: 'Weak Hash Algorithm',
                line: index + 1,
                snippet: line.trim(),
                id: 'weak-crypto',
                roast: "MD5? What is this, 1996? Use SHA-256 or better, Grandpa."
            });
        }
    });

    return issues;
}
