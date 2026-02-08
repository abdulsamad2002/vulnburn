# 🔥 VulnBurn

> **Security Scanner with Attitude.**  
> _Because your code is bad and you should feel bad._

[![npm version](https://img.shields.io/npm/v/vulnburn.svg)](https://www.npmjs.com/package/vulnburn)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

VulnBurn is a zero config, blazing fast security scanner for Node.js, MERN stack, and modern web applications. It doesn't just find vulnerabilities; it **roasts** you for them. Because it finds is really silly so it shouldn't have occured in the first place.

Designed for novice developers for whom security is an afterthought (or they just don't care about it) and the "Oh no, I almost committed that" moment.

## Usage Guide

The CLI is straightforward. Run it in your terminal:

```bash
npx vulnburn
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
## Global Installation


For frequent use.

```bash
npm install -g vulnburn
vulnburn
```
## 🤝 Contributing

1.  Fork it.
2.  Fix your own code first.
3.  Submit a PR.

## 📝 License

ISC
