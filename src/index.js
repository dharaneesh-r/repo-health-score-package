import { createClient, getRepo } from './utils/github.js';
import readmeCheck from './checks/readme.js';
import licenseCheck from './checks/license.js';
import ciCheck from './checks/ci.js';
import testsCheck from './checks/tests.js';
import issuesCheck from './checks/issues.js';
import commitsCheck from './checks/commits.js';
import contributingCheck from './checks/contributing.js';

/**
 * Scores a GitHub repository based on several health metrics.
 * @param {string} ownerRepo - GitHub repository in "owner/repo" format.
 * @param {string} [token] - GitHub personal access token.
 * @returns {Promise<Object>} The score result.
 */
export async function scoreRepo(ownerRepo, token) {
  if (!ownerRepo || !ownerRepo.includes('/') || ownerRepo.split('/').length !== 2) {
    throw new Error('Invalid repo format. Use owner/repo');
  }

  const [owner, repo] = ownerRepo.split('/');
  if (!owner || !repo) {
    throw new Error('Invalid repo format. Use owner/repo');
  }

  const client = createClient(token);
  const repoData = await getRepo(client, owner, repo);

  const checkFunctions = [
    readmeCheck,
    licenseCheck,
    ciCheck,
    testsCheck,
    issuesCheck,
    commitsCheck,
    contributingCheck
  ];

  const checks = await Promise.all(
    checkFunctions.map(check => check(client, owner, repo, repoData))
  );

  const total = checks.reduce((sum, check) => sum + check.score, 0);

  let grade = 'F';
  if (total >= 90) grade = 'A';
  else if (total >= 75) grade = 'B';
  else if (total >= 60) grade = 'C';
  else if (total >= 40) grade = 'D';

  return {
    repo: ownerRepo,
    total,
    grade,
    checks,
    generatedAt: new Date().toISOString()
  };
}
