# 🔥 VulnBurn

> **Security Scanner with Attitude.**  
> _Because your code is bad and you should feel bad._

[![npm version](https://img.shields.io/npm/v/vulnburn.svg)](https://www.npmjs.com/package/vulnburn)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

VulnBurn is a zero-config, blazing fast security scanner for Node.js, MERN stack, and modern web applications. It doesn't just find vulnerabilities; it **roasts** you for them.

Designed for the "Oh no, I almost committed that" moment.

## 🚀 Usage Guide

The CLI is straightforward. Run it in your terminal:

```bash
npx vulnburn [directory] [options]
```

### Arguments

| Argument    | Description                                                                 | Default                 |
| :---------- | :-------------------------------------------------------------------------- | :---------------------- |
| `directory` | The directory path you want to scan. Can be relative (`./src`) or absolute. | `.` (Current Directory) |

### Options

| Option      | Alias | Description                                                                                                                         |
| :---------- | :---- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `--verbose` | `-v`  | Outputs the raw JSON scan results instead of the pretty-printed roast report. Useful for debugging or integrating with other tools. |
| `--help`    | `-h`  | Display help for command.                                                                                                           |
| `--version` | `-V`  | Output the version number.                                                                                                          |

### Examples

**1. Standard Scan (Current Directory)**

```bash
npx vulnburn
```

**2. Scan a Specific Folder**

```bash
npx vulnburn ./src/api
```

**3. Get Raw JSON Output (Verbose)**
Great for piping into jq or saving to a file.

```bash
npx vulnburn . --verbose > scan-results.json
```

---

## 📦 Installation Options

### Instant Run (Recommended)

No installation needed.

```bash
npx vulnburn
```

### Global Install

For frequent use.

```bash
npm install -g vulnburn
vulnburn
```

### Dev Dependency (CI/CD)

Add to your project to run locally or in pipelines.

```bash
npm install --save-dev vulnburn
```

Then add to `package.json` scripts:

```json
"scripts": {
  "scan": "vulnburn"
}
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
