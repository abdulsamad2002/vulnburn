export class CryptoScanner {
    constructor() {
        this.patterns = {
            weak_crypto: {
                md5: {
                    regex: /(md5|MD5|createHash\(['"]md5['"]\))/,
                    severity: 'medium',
                    description: 'MD5 is insecure for passwords'
                },
                sha1: {
                    regex: /(sha1|SHA1|createHash\(['"]sha1['"]\))/,
                    severity: 'medium',
                    description: 'SHA1 is deprecated and collision-prone'
                },
                des: {
                    regex: /(DES|des-ede3-cbc|DES)/,
                    severity: 'medium',
                    description: 'DES is obsolete and crackable'
                },
                rc4: {
                    regex: /(RC4|rc4)/,
                    severity: 'medium',
                    description: 'RC4 is broken and insecure'
                },
                blowfish: {
                    regex: /(Blowfish|BF-CBC)/,
                    severity: 'medium',
                    description: 'Blowfish is old, prefer AES'
                }
            },
            weak_random: {
                math_random: {
                    regex: /Math\.random\(\)/,
                    severity: 'medium',
                    description: 'Math.random() is not cryptographically secure'
                },
                pseudo_random: {
                    regex: /xsrand|srand|lcg/,
                    severity: 'medium',
                    description: 'Weak Pseudo-Random Number Generator detected'
                }
            },
            mode_of_operation: {
                ecb: {
                    regex: /AES-ECB|aes-128-ecb|aes-256-ecb/i,
                    severity: 'high',
                    description: 'ECB mode is insecure (pattern leakage)'
                }
            }
        };
    }

    scan(file) {
        const issues = [];
        const lines = file.content.split('\n');

        lines.forEach((line, index) => {
            // Basic check if regex exists in line
            if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*') || line.trim().startsWith('*')) return;

            for (const [category, subtypes] of Object.entries(this.patterns)) {
                for (const [subtype, pattern] of Object.entries(subtypes)) {
                    if (pattern.regex.test(line)) {
                        issues.push({
                            type: 'crypto_issue',
                            subtype: category + '/' + subtype,
                            severity: pattern.severity,
                            description: pattern.description,
                            file: file.path,
                            line: index + 1,
                            snippet: line.trim(),
                            context: line.trim()
                        });
                    }
                }
            }
        });

        return issues;
    }
}
