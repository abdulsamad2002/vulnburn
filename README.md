# 🔥 VulnBurn

> **Security Scanner with Attitude.**  
> _Because your code is bad and you should feel bad._

[![npm version](https://img.shields.io/npm/v/vulnburn.svg)](https://www.npmjs.com/package/vulnburn)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

VulnBurn is a zero-config, blazing fast security scanner for Node.js, MERN stack, and modern web applications. It doesn't just find vulnerabilities; it **roasts** you for them.

Designed for the "Oh no, I almost committed that" moment.

## 🚀 Features

- **50+ Vulnerability Checks**: Covers OWASP Top 10, MERN-specific flaws, and cloud secrets.
- **Zero Config**: Just run it. No complex YAML files.
- **Secrets Detection**: Finds AWS, Stripe, Google, OpenAI, Slack, GitHub tokens, and more.
- **SAST Engine**: Detects SQL/NoSQL injection, XSS, eval(), command injection, and logic flaws.
- **Crypto Audit**: flags weak algorithms (MD5, SHA1, DES, ECB mode).
- **Attitude**: The error messages will hurt your feelings. (You're welcome).

## 📦 Installation

Run it directly with `npx` (Recommended):

```bash
npx vulnburn@latest
```

Or install globally:

```bash
npm install -g vulnburn
```

## 🛠 Usage

Scan the current directory:

```bash
vulnburn
```

Scan a specific directory:

```bash
vulnburn ./src
```

## 📸 Example Output

```text
🔥 VULNBURN ACTIVATED 🔥
Target locked: .

Scanning for questionable life choices...
√ Scan complete. Prepare to be roasted.

Found 3 total failures.
  Critical: 1  High: 1  Medium: 1  Low: 0

🛑 #1: Possible SQL Injection (Variable Concatenation)
   "Bobby Tables would be proud of this SQL injection in database.js."
   📍 src/database.js:42
   💻 Code: const query = "SELECT * FROM users WHERE id = " + req.body.id;

🔥 #2: AWS Access Key ID
   "I see you've hardcoded an AWS key in config.js. Jeff Bezos thanks you for the donation."
   📍 src/config.js:12
   💻 Code: const awsKey = "AKIAIMTHEREALKEY123";

⚠️ #3: MD5 is insecure for passwords
   "MD5? I can crack this hash on a toaster."
   📍 src/utils/hash.js:5
   💻 Code: return md5(password);

 FINAL VERDICT  Build Failed. Fix your code.
```

## 🛡️ What It Scans (The "Roast" List)

### 🔑 Hardcoded Secrets

- **Cloud**: AWS (Keys), Azure, Google (API Keys, OAuth), Heroku.
- **SaaS**: Stripe, Slack, GitHub, NPM, Twilio, SendGrid, Facebook.
- **AI**: OpenAI, Anthropic (Claude).
- **Misc**: Private Keys (RSA/DSA/PGP), JWTs, Database Strings (MySQL, Postgres, Mongo), Redis.

### 💻 Code Security (SAST)

- **Injection**: SQL Injection, NoSQL Injection (`$where`), Command Injection (`exec`, `spawn`).
- **XSS**: React (`dangerouslySetInnerHTML`), `javascript:` URIs, DOM sinks.
- **Misconfiguration**: CORS (`*`), Hardcoded Ports, Debug Mode, Docker (`root`).
- **Logic**: SSRF (Axios/Fetch), Path Traversal, Unsafe Redirects, ReDoS.

### 🔒 Cryptography

- **Weak Algos**: MD5, SHA1, DES, RC4, Blowfish.
- **Bad Practices**: ECB Mode, `Math.random()` for crypto.

## 🤝 Contributing

1.  Fork it.
2.  Fix your own code first.
3.  Submit a PR.

## 📝 License

ISC
