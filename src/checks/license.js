import { getContents } from '../utils/github.js';

export default async function licenseCheck(client, owner, repo) {
  const files = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'];
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
      name: 'License',
      score: 0,
      max: 10,
      message: 'No license file found'
    };
  }

  return {
    name: 'License',
    score: 10,
    max: 10,
    message: `License file found: ${foundFile}`
  };
}
