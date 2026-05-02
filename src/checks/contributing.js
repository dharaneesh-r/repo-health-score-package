import { getContents } from '../utils/github.js';

export default async function contributingCheck(client, owner, repo) {
  const files = ['CONTRIBUTING.md', 'CONTRIBUTING', '.github/CONTRIBUTING.md'];
  let foundFile = null;

  for (const file of files) {
    const data = await getContents(client, owner, repo, file);
    if (data) {
      foundFile = file;
      break;
    }
  }

  if (!foundFile) {
    return {
      name: 'Contributing',
      score: 0,
      max: 10,
      message: 'No CONTRIBUTING guide found'
    };
  }

  return {
    name: 'Contributing',
    score: 10,
    max: 10,
    message: `CONTRIBUTING guide found: ${foundFile}`
  };
}
