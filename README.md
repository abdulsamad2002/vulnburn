# Vulnburn

> A security scanner with an attitude.

Vulnburn is a command-line tool that scans your code for vulnerabilities and roasts you for them. It's like having a senior engineer looking over your shoulder, but without the helpful advice.

## Installation

```bash
npm install -g vulnburn
```

## Usage

Run the scanner in your project directory:

```bash
vulnburn
```

Or specify a directory:

```bash
vulnburn ./src
```

## Features

- **Secrets Scanner**: Finds hardcoded API keys and passwords.
- **Code Scanner**: Detects dangerous functions like `eval()` and left-over `console.log`.
- **Crypto Scanner**: Identifies weak cryptographic algorithms (MD5, etc.).
- **Roasts**: Provides helpful feedback in the most unhelpful way possible.

## Contributing

Don't. Just fix your code.

## License

ISC
