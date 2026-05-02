export default async function commitsCheck(client, owner, repo, repoData) {
  const pushedAt = new Date(repoData.pushed_at);
  const now = new Date();
  const diffTime = Math.abs(now - pushedAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) {
    return {
      name: 'Commit recency',
      score: 10,
      max: 10,
      message: `Last commit was ${diffDays} days ago — very active`
    };
  }

  if (diffDays <= 90) {
    return {
      name: 'Commit recency',
      score: 7,
      max: 10,
      message: `Last commit was ${diffDays} days ago — moderately active`
    };
  }

  if (diffDays <= 365) {
    return {
      name: 'Commit recency',
      score: 4,
      max: 10,
      message: `Last commit was ${diffDays} days ago — low activity`
    };
  }

  return {
    name: 'Commit recency',
    score: 0,
    max: 10,
    message: 'Last commit was over a year ago'
  };
}
