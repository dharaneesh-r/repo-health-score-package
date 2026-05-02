import { getContents } from '../utils/github.js';

export default async function testsCheck(client, owner, repo) {
  const folders = ['test', 'spec', '__tests__'];
  let testFolderFound = false;

  for (const folder of folders) {
    const data = await getContents(client, owner, repo, folder);
    if (data && Array.isArray(data)) {
      testFolderFound = true;
      break;
    }
  }

  const pkgData = await getContents(client, owner, repo, 'package.json');
  let testScriptFound = false;

  if (pkgData) {
    try {
      const content = Buffer.from(pkgData.content, 'base64').toString('utf8');
      const pkg = JSON.parse(content);
      const testScript = pkg.scripts?.test;
      if (testScript && testScript !== 'echo "Error: no test specified" && exit 1') {
        testScriptFound = true;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  if (testFolderFound && testScriptFound) {
    return {
      name: 'Tests',
      score: 20,
      max: 20,
      message: 'Test directory and test script found'
    };
  } else if (testFolderFound) {
    return {
      name: 'Tests',
      score: 12,
      max: 20,
      message: 'Test directory found but no test script in package.json'
    };
  } else if (testScriptFound) {
    return {
      name: 'Tests',
      score: 8,
      max: 20,
      message: 'Test script found but no test directory'
    };
  }

  return {
    name: 'Tests',
    score: 0,
    max: 20,
    message: 'No tests found'
  };
}
