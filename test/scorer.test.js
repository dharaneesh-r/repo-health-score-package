import { jest } from '@jest/globals';

// Mock octokit
jest.unstable_mockModule('octokit', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      repos: {
        get: jest.fn().mockResolvedValue({
          data: {
            pushed_at: new Date().toISOString(),
            open_issues_count: 0,
            has_issues: true
          }
        }),
        getContent: jest.fn().mockResolvedValue({
          data: {
            content: Buffer.from('# Hello\ninstall usage example license').toString('base64'),
            name: 'README.md'
          }
        })
      },
      actions: {
        listRepoWorkflows: jest.fn().mockResolvedValue({
          data: { workflows: [{ id: 1 }] }
        })
      }
    }
  }))
}));

const { scoreRepo } = await import('../src/index.js');

describe('scoreRepo', () => {
  it('throws if repo format is invalid', async () => {
    await expect(scoreRepo('justarepo')).rejects.toThrow('Invalid repo format. Use owner/repo');
    await expect(scoreRepo('owner/repo/extra')).rejects.toThrow('Invalid repo format. Use owner/repo');
  });

  it('returns an object with expected keys', async () => {
    const result = await scoreRepo('owner/repo');
    expect(result).toHaveProperty('repo');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('grade');
    expect(result).toHaveProperty('checks');
    expect(result).toHaveProperty('generatedAt');
  });

  it('has exactly 7 checks', async () => {
    const result = await scoreRepo('owner/repo');
    expect(result.checks).toHaveLength(7);
  });

  it('returns a total between 0 and 100', async () => {
    const result = await scoreRepo('owner/repo');
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it('each check has required keys', async () => {
    const result = await scoreRepo('owner/repo');
    result.checks.forEach(check => {
      expect(check).toHaveProperty('name');
      expect(check).toHaveProperty('score');
      expect(check).toHaveProperty('max');
      expect(check).toHaveProperty('message');
    });
  });

  it('returns grade A when total >= 90', async () => {
    const result = await scoreRepo('owner/repo');
    if (result.total >= 90) {
      expect(result.grade).toBe('A');
    }
  });
});
