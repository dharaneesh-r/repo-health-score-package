import { Octokit } from 'octokit';

/**
 * Creates and returns an Octokit instance authenticated with the given token.
 * If token is undefined or empty, create an unauthenticated client.
 */
export function createClient(token) {
  if (!token) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Warning: No GitHub token provided. You may hit rate limits (60 requests/hour).');
    }
    return new Octokit();
  }
  return new Octokit({ auth: token });
}

/**
 * Calls client.rest.repos.get({ owner, repo })
 * Returns the full repo data object.
 */
export async function getRepo(client, owner, repo) {
  const { data } = await client.rest.repos.get({ owner, repo });
  return data;
}

/**
 * Calls client.rest.repos.getContent({ owner, repo, path })
 * Returns data on success, returns null if the file/folder is not found.
 */
export async function getContents(client, owner, repo, path) {
  try {
    const { data } = await client.rest.repos.getContent({ owner, repo, path });
    return data;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Calls client.rest.actions.listRepoWorkflows({ owner, repo })
 * Returns the list of workflows, or an empty array if GitHub Actions is not enabled.
 */
export async function listWorkflows(client, owner, repo) {
  try {
    const { data } = await client.rest.actions.listRepoWorkflows({ owner, repo });
    return data.workflows || [];
  } catch (error) {
    return [];
  }
}
