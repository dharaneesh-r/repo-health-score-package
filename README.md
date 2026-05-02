# repo-health-score

> Score the health of any GitHub repository from **0 to 100** — instantly, from your terminal.

[![npm version](https://img.shields.io/npm/v/repo-health-score)](https://www.npmjs.com/package/repo-health-score)
[![npm downloads](https://img.shields.io/npm/dm/repo-health-score)](https://www.npmjs.com/package/repo-health-score)
[![license](https://img.shields.io/badge/license-MIT-brightgreen)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org)

```
  repo-health-score — facebook/react

  Score : 97/100  (Grade: A)

  ──────────────────────────────────────────────────────
  ✓  README quality        20/20  README found, keywords: install, usage, example, license
  ✓  License               10/10  License file found: LICENSE
  ✓  CI setup              15/15  Found 6 GitHub Actions workflow(s)
  ✓  Tests                 20/20  Test directory and test script found
  ✓  Open issues           15/15  No open issues — great maintenance!
  ✓  Commit recency        10/10  Last commit 1 days ago — very active
  ~  Contributing guide     7/10  No CONTRIBUTING guide found
  ──────────────────────────────────────────────────────
```

---

## What it checks

| Check | Max Points | What it measures |
|---|---|---|
| README quality | 20 | File exists, length, key sections (install, usage, example, license) |
| Tests | 20 | Test folder present + valid test script in package.json |
| CI setup | 15 | GitHub Actions workflows or alternative CI config |
| Open issues | 15 | Number of open issues and maintenance activity |
| License | 10 | LICENSE file present in the repository |
| Commit recency | 10 | How recently the last commit was pushed |
| Contributing guide | 10 | CONTRIBUTING.md present for contributors |
| **Total** | **100** | |

## Grades

| Score | Grade |
|---|---|
| 90 – 100 | A |
| 75 – 89 | B |
| 60 – 74 | C |
| 40 – 59 | D |
| 0 – 39 | F |

---

## Installation

Install globally to use as a CLI from anywhere:

```bash
npm install -g repo-health-score
```

Or run without installing using npx:

```bash
npx repo-health-score facebook/react
```

---

## Usage

### Basic

```bash
repo-health-score <owner/repo>
```

### With a GitHub token (recommended)

```bash
repo-health-score facebook/react --token ghp_yourtoken
```

Or set it as an environment variable so you never have to pass it manually:

```bash
export GITHUB_TOKEN=ghp_yourtoken
repo-health-score facebook/react
```

### Output as JSON

```bash
repo-health-score facebook/react --json
```

```json
{
  "repo": "facebook/react",
  "total": 97,
  "grade": "A",
  "checks": [
    { "name": "README quality", "score": 20, "max": 20, "message": "README found with all key sections" },
    { "name": "License", "score": 10, "max": 10, "message": "License file found: LICENSE" }
  ],
  "generatedAt": "2026-05-02T16:03:46.618Z"
}
```

### Output as a badge

```bash
repo-health-score facebook/react --badge
```

```
[![Health Score](https://img.shields.io/badge/health_score-97%2F100-brightgreen)](https://github.com/facebook/react)
```

Paste this directly into your own README to show your repo's health score.

---

## Options

| Flag | Short | Description |
|---|---|---|
| `--token <token>` | `-t` | GitHub personal access token |
| `--json` | | Output full result as JSON |
| `--badge` | | Output a shields.io badge markdown snippet |
| `--version` | `-V` | Show version number |
| `--help` | `-h` | Show help |

---

## GitHub Token

A token is **optional** but strongly recommended.

Without a token you are limited to **60 API requests per hour** by GitHub. With a token you get **5,000 requests per hour**.

Create a free token at [github.com/settings/tokens](https://github.com/settings/tokens) — only the `public_repo` scope is needed for public repositories.

```bash
# Add to ~/.zshrc or ~/.bashrc to set it permanently
export GITHUB_TOKEN=ghp_yourtoken
```

---

## Example — score your own repo

```bash
repo-health-score your-username/your-repo
```

Use the output to identify exactly what's missing and improve your repo's health step by step.

---

## Add a badge to your README

Run this in your terminal:

```bash
repo-health-score your-username/your-repo --badge
```

Copy the output and paste it at the top of your `README.md`. The badge automatically reflects your score:

- 🟢 Green — score 75 and above
- 🟡 Yellow — score 50 to 74
- 🔴 Red — score below 50

---

## Use as a library

You can also import the scorer directly into your own Node.js project:

```js
import { scoreRepo } from "repo-health-score";

const result = await scoreRepo("facebook/react", process.env.GITHUB_TOKEN);

console.log(result.total);   // 97
console.log(result.grade);   // "A"
console.log(result.checks);  // array of 7 check results
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

To run the project locally:

```bash
git clone https://github.com/your-username/repo-health-score
cd repo-health-score
npm install
npm test
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.
