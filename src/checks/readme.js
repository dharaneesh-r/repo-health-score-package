import { getContents } from '../utils/github.js';

export default async function readmeCheck(client, owner, repo) {
  const fallbacks = ['README.md', 'README', 'readme.md'];
  let readme = null;
  let filename = '';

  for (const path of fallbacks) {
    readme = await getContents(client, owner, repo, path);
    if (readme) {
      filename = path;
      break;
    }
  }

  if (!readme) {
    return {
      name: 'README quality',
      score: 0,
      max: 20,
      message: 'No README found'
    };
  }

  const content = Buffer.from(readme.content, 'base64').toString('utf8');
  const length = content.length;

  if (length < 200) {
    return {
      name: 'README quality',
      score: 5,
      max: 20,
      message: 'README exists but is very short'
    };
  }

  if (length >= 200 && length <= 800) {
    return {
      name: 'README quality',
      score: 12,
      max: 20,
      message: 'README exists but could be more detailed'
    };
  }

  // length > 800
  const keywords = ['install', 'usage', 'example', 'license'];
  const foundKeywords = keywords.filter(kw => content.toLowerCase().includes(kw));
  const bonusPoints = Math.min(foundKeywords.length * 2, 8);
  const totalScore = 12 + bonusPoints;

  return {
    name: 'README quality',
    score: totalScore,
    max: 20,
    message: `README found with key sections: ${foundKeywords.join(', ') || 'none'}`
  };
}
