import { listWorkflows, getContents } from '../utils/github.js';

export default async function ciCheck(client, owner, repo) {
  const workflows = await listWorkflows(client, owner, repo);

  if (workflows.length > 0) {
    return {
      name: 'CI setup',
      score: 15,
      max: 15,
      message: `Found ${workflows.length} GitHub Actions workflow(s)`
    };
  }

  const fallbacks = ['.travis.yml', 'circle.yml'];
  for (const file of fallbacks) {
    const data = await getContents(client, owner, repo, file);
    if (data) {
      return {
        name: 'CI setup',
        score: 10,
        max: 15,
        message: `Found alternative CI config (${file})`
      };
    }
  }

  return {
    name: 'CI setup',
    score: 0,
    max: 15,
    message: 'No CI configuration found'
  };
}
