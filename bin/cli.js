#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { scoreRepo } from '../src/index.js';

program
  .name('repo-health-score')
  .description('Score the health of any GitHub repository')
  .version('1.0.0')
  .argument('<repo>', 'GitHub repository in owner/repo format')
  .option('-t, --token <token>', 'GitHub personal access token (overrides GITHUB_TOKEN env var)')
  .option('--json', 'Output the full result as JSON')
  .option('--badge', 'Output a shields.io badge markdown snippet')
  .action(async (repo, opts) => {
    const token = opts.token || process.env.GITHUB_TOKEN;
    const spinner = ora(`Scoring ${repo}...`).start();

    try {
      const result = await scoreRepo(repo, token);
      spinner.stop();

      if (opts.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      if (opts.badge) {
        let color = 'red';
        if (result.total >= 75) color = 'brightgreen';
        else if (result.total >= 50) color = 'yellow';

        console.log(`[![Health Score](https://img.shields.io/badge/health_score-${result.total}%2F100-${color})](https://github.com/${result.repo})`);
        return;
      }

      // Default human-readable output
      console.log(`\n  repo-health-score — ${chalk.bold(result.repo)}\n`);
      console.log(`  Score : ${chalk.bold(result.total)}/100  (Grade: ${chalk.bold(result.grade)})\n`);
      console.log('  ' + '-'.repeat(60));

      result.checks.forEach(check => {
        let icon = chalk.red('✗');
        if (check.score === check.max) {
          icon = chalk.green('✓');
        } else if (check.score > 0) {
          icon = chalk.yellow('~');
        }

        const name = check.name.padEnd(20);
        const score = `${check.score}/${check.max}`.padStart(6);
        console.log(`  ${icon}  ${name} ${score}  ${check.message}`);
      });

      console.log('  ' + '-'.repeat(60));
      console.log(`  Generated: ${result.generatedAt}\n`);

    } catch (err) {
      spinner.fail(err.message);
      process.exit(1);
    }
  });

program.parse();
