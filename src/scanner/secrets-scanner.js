export class SecretsScanner {
    constructor() {
        this.patterns = {
            aws: [
                { regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/, description: 'AWS Access Key ID', severity: 'critical' },
                { regex: /(" |')([A-Za-z0-9/+=]{40})(" |')/, description: 'Potential AWS Secret Key', severity: 'critical', checkContext: 'aws' }
            ],
            azure: [
                { regex: /(" |')([a-z0-9]{52})(" |')/, description: 'Azure Storage Key', severity: 'critical' },
                { regex: /(" |')[a-zA-Z0-9-]{36}(" |')/, description: 'Azure Client Secret (Potential)', severity: 'high' }
            ],
            google: [
                { regex: /AIza[0-9A-Za-z-_]{35}/, description: 'Google API Key', severity: 'critical' },
                { regex: /(" |')([0-9]+-[0-9a-zA-Z_]{32}\.apps\.googleusercontent\.com)(" |')/, description: 'Google OAuth Client ID', severity: 'high' }
            ],
            github: [
                { regex: /(ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,255}/, description: 'GitHub Personal Access Token', severity: 'critical' },
                { regex: /git:\/\/[^:]+:[^@]+@github\.com/, description: 'GitHub URL with Credentials', severity: 'critical' }
            ],
            npm: [
                { regex: /npm_[a-zA-Z0-9]{36}/, description: 'NPM Access Token', severity: 'critical' }
            ],
            openai: [
                { regex: /sk-[a-zA-Z0-9]{20,}/, description: 'OpenAI API Key', severity: 'critical' },
                { regex: /sk-proj-[a-zA-Z0-9]{20,}/, description: 'OpenAI Project Key', severity: 'critical' }
            ],
            anthropic: [
                { regex: /sk-ant-api03-[a-zA-Z0-9\-_]{86}/, description: 'Anthropic API Key', severity: 'critical' }
            ],
            stripe: [
                { regex: /(sk_live|rk_live)_[0-9a-zA-Z]{24}/, description: 'Stripe Live Secret Key', severity: 'critical' },
                { regex: /stripe_test_[0-9a-zA-Z]{24}/, description: 'Stripe Test Key', severity: 'medium' }
            ],
            slack: [
                { regex: /xox[baprs]-([0-9a-zA-Z]{10,48})/, description: 'Slack Token', severity: 'critical' },
                { regex: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8}\/B[a-zA-Z0-9_]{8}\/[a-zA-Z0-9_]{24}/, description: 'Slack Webhook URL', severity: 'high' }
            ],
            heroku: [
                { regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/, description: 'Heroku API Key (UUID)', severity: 'high', checkContext: 'heroku' }
            ],
            twilio: [
                { regex: /AC[a-zA-Z0-9_]{32}/, description: 'Twilio Account SID', severity: 'high' },
                { regex: /SK[a-zA-Z0-9_]{32}/, description: 'Twilio API Key', severity: 'critical' }
            ],
            sendgrid: [
                { regex: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/, description: 'SendGrid API Key', severity: 'critical' }
            ],
            facebook: [
                { regex: /[0-9]{13,17}\|[0-9a-zA-Z]{20,}/, description: 'Facebook Access Token', severity: 'critical' }
            ],
            jwt: [
                { regex: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/, description: 'Hardcoded JWT Token', severity: 'high', minLength: 100 }
            ],
            private_keys: [
                { regex: /-----BEGIN PRIVATE KEY-----/, description: 'Generic Private Key', severity: 'critical' },
                { regex: /-----BEGIN RSA PRIVATE KEY-----/, description: 'RSA Private Key', severity: 'critical' },
                { regex: /-----BEGIN DSA PRIVATE KEY-----/, description: 'DSA Private Key', severity: 'critical' },
                { regex: /-----BEGIN EC PRIVATE KEY-----/, description: 'EC Private Key', severity: 'critical' },
                { regex: /-----BEGIN OPENSSH PRIVATE KEY-----/, description: 'OpenSSH Private Key', severity: 'critical' },
                { regex: /-----BEGIN PGP PRIVATE KEY BLOCK-----/, description: 'PGP Private Key', severity: 'critical' }
            ],
            generic: [
                { regex: /(password|passwd|pwd|secret|token|api_key|access_key|auth_token)\s*[:=]\s*("|')[a-zA-Z0-9@#$%^&*()_+!]{8,}("|')/i, description: 'Generic Hardcoded Secret Assignment', severity: 'high' },
                { regex: /amqp:\/\/[^:]+:[^@]+@/, description: 'Hardcoded AMQP Credentials', severity: 'critical' },
                { regex: /mongodb(?:\+srv)?:\/\/[^:]+:[^@]+@/, description: 'Hardcoded MongoDB Credentials', severity: 'critical' },
                { regex: /postgres:\/\/[^:]+:[^@]+@/, description: 'Hardcoded Postgres Credentials', severity: 'critical' },
                { regex: /mysql:\/\/[^:]+:[^@]+@/, description: 'Hardcoded MySQL Credentials', severity: 'critical' },
                { regex: /redis:\/\/[^:]+:[^@]+@/, description: 'Hardcoded Redis Credentials', severity: 'critical' }
            ]
        };
    }

    scan(file) {
        const issues = [];
        const lines = file.content.split('\n');

        lines.forEach((line, index) => {
            // Basic comment heuristic
            if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*') || line.trim().startsWith('*')) return;

            for (const [subtype, patternList] of Object.entries(this.patterns)) {
                for (const pattern of patternList) {
                    const match = line.match(pattern.regex);
                    if (match) {
                        if (pattern.minLength && match[0].length < pattern.minLength) continue;

                        const secret = match[0];
                        const redactedSecret = secret.length > 8 ?
                            secret.substring(0, 4) + '...' + secret.substring(secret.length - 4) :
                            '***REDACTED***';

                        const context = line.replace(secret, redactedSecret).trim();

                        issues.push({
                            type: 'hardcoded_secret',
                            subtype: subtype,
                            severity: pattern.severity,
                            description: pattern.description,
                            file: file.path,
                            line: index + 1,
                            snippet: context,
                            context: context
                        });
                    }
                }
            }
        });

        return issues;
    }
}
