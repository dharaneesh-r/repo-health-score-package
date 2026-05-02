import { jest } from '@jest/globals';
import readmeCheck from '../src/checks/readme.js';
import licenseCheck from '../src/checks/license.js';
import commitsCheck from '../src/checks/commits.js';
import issuesCheck from '../src/checks/issues.js';

const mockClient = {
  rest: {
    repos: {
      getContent: jest.fn()
    }
  }
};

describe('Check Logic', () => {
  describe('readmeCheck', () => {
    it('returns score 0 when getContents returns null', async () => {
      mockClient.rest.repos.getContent.mockRejectedValue({ status: 404 });
      const result = await readmeCheck(mockClient, 'o', 'r');
      expect(result.score).toBe(0);
    });

    it('returns score 20 when README is long and has keywords', async () => {
      const longContent = '# '.repeat(500) + ' install usage example license';
      mockClient.rest.repos.getContent.mockResolvedValue({
        data: { content: Buffer.from(longContent).toString('base64') }
      });
      const result = await readmeCheck(mockClient, 'o', 'r');
      expect(result.score).toBe(20);
    });
  });

  describe('licenseCheck', () => {
    it('returns score 10 when LICENSE file is found', async () => {
      mockClient.rest.repos.getContent.mockResolvedValue({ data: { name: 'LICENSE' } });
      const result = await licenseCheck(mockClient, 'o', 'r');
      expect(result.score).toBe(10);
    });
  });

  describe('commitsCheck', () => {
    it('returns score 10 when pushed_at is yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = await commitsCheck(null, null, null, { pushed_at: yesterday.toISOString() });
      expect(result.score).toBe(10);
    });

    it('returns score 0 when pushed_at is 2 years ago', async () => {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      const result = await commitsCheck(null, null, null, { pushed_at: twoYearsAgo.toISOString() });
      expect(result.score).toBe(0);
    });
  });

  describe('issuesCheck', () => {
    it('returns score 15 when open_issues_count is 0', async () => {
      const result = await issuesCheck(null, null, null, { open_issues_count: 0, has_issues: true });
      expect(result.score).toBe(15);
    });

    it('returns score 3 when open_issues_count is 100', async () => {
      const result = await issuesCheck(null, null, null, { open_issues_count: 100, has_issues: true });
      expect(result.score).toBe(3);
    });
  });
});
