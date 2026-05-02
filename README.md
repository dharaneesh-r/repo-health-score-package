# repo-health-score

> Score the health of any GitHub repository from 0 to 100.

## Install

```bash
npm install -g repo-health-score
```

## Usage

```bash
# Basic usage
repo-health-score --repo owner/repo

# With a GitHub token (recommended to avoid rate limits)
repo-health-score --repo owner/repo --token ghp_yourtoken

# Or set the token as an environment variable
export GITHUB_TOKEN=ghp_yourtoken
repo-health-score --repo owner/repo

# Output as JSON
repo-health-score --repo owner/repo --json

# Output as a shields.io badge
repo-health-score --repo owner/repo --badge
```

## Scoring breakdown

| Check           | Max Points | What it measures                       |
|-----------------|------------|----------------------------------------|
| README quality  | 20         | Exists, length, key sections           |
| Tests           | 20         | Test folder and test script present    |
| CI setup        | 15         | GitHub Actions or other CI config      |
| Open issues     | 15         | Ratio of open to total issues          |
| License         | 10         | LICENSE file present                   |
| Commit recency  | 10         | Days since last commit                 |
| Contributing    | 10         | CONTRIBUTING guide present             |
| **Total**       | **100**    |                                        |

## Grades

| Score  | Grade |
|--------|-------|
| 90–100 | A     |
| 75–89  | B     |
| 60–74  | C     |
| 40–59  | D     |
| 0–39   | F     |

## GitHub Token

A token is optional but strongly recommended. Without one you are limited to 60 API requests per hour.
Create a token at https://github.com/settings/tokens — only public_repo scope is needed.

## License

MIT
