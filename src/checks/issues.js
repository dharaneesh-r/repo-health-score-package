export default async function issuesCheck(client, owner, repo, repoData) {
  const { open_issues_count, has_issues } = repoData;

  if (has_issues === false) {
    return {
      name: 'Open issues',
      score: 10,
      max: 15,
      message: 'Issues are disabled for this repo'
    };
  }

  if (open_issues_count === 0) {
    return {
      name: 'Open issues',
      score: 15,
      max: 15,
      message: 'No open issues — great maintenance!'
    };
  }

  if (open_issues_count >= 1 && open_issues_count <= 10) {
    return {
      name: 'Open issues',
      score: 12,
      max: 15,
      message: `${open_issues_count} open issues`
    };
  }

  if (open_issues_count >= 11 && open_issues_count <= 50) {
    return {
      name: 'Open issues',
      score: 8,
      max: 15,
      message: `${open_issues_count} open issues — consider triaging`
    };
  }

  return {
    name: 'Open issues',
    score: 3,
    max: 15,
    message: `${open_issues_count} open issues — repo may need attention`
  };
}
