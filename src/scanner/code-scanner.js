export class CodeScanner {
    constructor() {
        this.patterns = {
            // 1. Injection
            eval: {
                regex: /eval\s*\(/,
                description: 'Used eval() - Dangerous Code Execution (Critical)',
                severity: 'critical'
            },
            exec: {
                regex: /(child_process|cp)\.(exec|execSync|spawn|spawnSync)\s*\(\s*.*(\$|\+|`)/,
                description: 'Command Injection Risk in Child Process',
                severity: 'high'
            },
            sql_injection: {
                regex: /(SELECT|INSERT|UPDATE|DELETE|DROP)\s+.*\s*(\+)|(\${.*})/,
                description: 'Possible SQL Injection (Variable Concatenation)',
                severity: 'critical'
            },
            nosql_injection: {
                regex: /(\$where|\$ne|\$gt|\$lt|\$in)\s*:/,
                description: 'Potential NoSQL Injection (MongoDB Operator)',
                severity: 'high'
            },
            nosql_where: {
                regex: /\.find\(\s*{\s*\$where\s*:/,
                description: 'Dangerous $where in MongoDB query',
                severity: 'critical'
            },

            // 2. XSS (Cross-Site Scripting)
            xss_react: {
                regex: /dangerouslySetInnerHTML/,
                description: 'React: dangerouslySetInnerHTML used (XSS Risk)',
                severity: 'high'
            },
            xss_href: {
                regex: /href\s*=\s*("|'|`)\s*javascript:/i,
                description: 'XSS: javascript: URI in href',
                severity: 'high'
            },
            xss_innerhtml: {
                regex: /\.innerHTML\s*=/,
                description: 'DOM XSS: innerHTML assignment',
                severity: 'medium'
            },

            // 3. Broken Authentication
            hardcoded_jwt: {
                regex: /\.sign\(\s*.*,\s*['"]secret['"]\s*\)/,
                description: 'Weak/Hardcoded JWT Secret detected',
                severity: 'critical'
            },

            // 4. Insecure Design / Config
            cors_misconfig: {
                regex: /('Access-Control-Allow-Origin'|["']origin["'])\s*:\s*['"]\*['"]/,
                description: 'CORS: Wildcard Origin (*) is insecure',
                severity: 'high'
            },

            // 5. Security Misconfiguration
            debug_mode: {
                regex: /debug\s*:\s*true/i,
                description: 'Debug mode enabled in code',
                severity: 'high'
            },
            stack_trace: {
                regex: /res\.send\(\s*err\.stack\s*\)/,
                description: 'Leaking Stack Trace to user',
                severity: 'medium'
            },
            hardcoded_port: {
                regex: /\.listen\(\s*3000\s*\)/,
                description: 'Hardcoded Port 3000 (Use process.env.PORT)',
                severity: 'low'
            },
            docker_root: {
                regex: /USER\s+root/,
                description: 'Docker: Running as root',
                severity: 'medium'
            },

            // 6. Insecure Deserialization
            insecure_deserialization: {
                regex: /(pickle\.load|yaml\.load|unserialize|func_get_args)\s*\(/,
                description: 'Insecure Deserialization Detected',
                severity: 'critical'
            },
            unsafe_vm: {
                regex: /vm\.runInContext|vm\.runInNewContext/,
                description: 'Unsafe sandbox usage (vm module is not secure)',
                severity: 'high'
            },

            // 7. SSRF
            ssrf_axios: {
                regex: /axios\.(get|post|put)\(\s*req\./,
                description: 'Potential SSRF: Requesting user-controlled URL',
                severity: 'high'
            },

            // 8. Path Traversal
            path_traversal: {
                regex: /(\.\.\/|\.\.\\){2,}/,
                description: 'Potential Path Traversal (../)',
                severity: 'critical'
            },

            // 9. ReDoS
            redos: {
                regex: /\(.*\+.*\)\+/,
                description: 'Potential ReDoS (Catastrophic Backtracking)',
                severity: 'medium'
            },

            // 10. Unsafe Redirect
            unsafe_redirect: {
                regex: /res\.redirect\(\s*req\./,
                description: 'Unsafe Redirect (Open Redirect)',
                severity: 'medium'
            },

            // 11. Cookie Security
            insecure_cookie: {
                regex: /res\.cookie\(\s*.*,\s*.*,\s*{(?!.*secure)(?!.*httpOnly)/,
                description: 'Cookie set without secure/httpOnly flags',
                severity: 'medium'
            }
        };
    }

    scan(file) {
        const issues = [];
        const lines = file.content.split('\n');

        lines.forEach((line, index) => {
            // Comment Check
            if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('#')) return;

            for (const [type, info] of Object.entries(this.patterns)) {
                if (!info.regex) continue;

                const match = line.match(info.regex);
                if (match) {
                    // Exception for IP Hardcoded check
                    if (type === 'hardcoded_ip') {
                        // Skipped for robustness in this version
                        continue;
                    }

                    issues.push({
                        type: 'code_issue',
                        subtype: type,
                        severity: info.severity,
                        description: info.description,
                        file: file.path,
                        line: index + 1,
                        snippet: line.trim(),
                        context: line.trim() // standardizing keys
                    });
                }
            }
        });

        return issues;
    }
}
