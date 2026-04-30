import path from 'node:path';
import { describe, it, expect } from 'vitest';

// Import internal helpers directly to test without Vite runtime
// We test the load() output by invoking the plugin and parsing the generated module source.
import { dualabsDocsSource } from '../index';
import type { DocEntry } from '../types';

const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'api-repo');

function extractDefault(source: string): unknown {
  // Evaluate the generated `export default <json>;` module source
  const match = source.match(/export default ([\s\S]+);$/);
  if (!match || !match[1]) throw new Error('No default export found in source');
  return JSON.parse(match[1]);
}

describe('dualabsDocsSource plugin', () => {
  const plugin = dualabsDocsSource({ apiRepoPath: FIXTURE_PATH });

  describe('resolveId', () => {
    it('resolves manifest virtual id', () => {
      const result = (plugin.resolveId as Function)('virtual:dualabs-docs/manifest', undefined, {});
      expect(result).toBe('\0virtual:dualabs-docs/manifest');
    });

    it('resolves openapi virtual id', () => {
      const result = (plugin.resolveId as Function)('virtual:dualabs-docs/openapi', undefined, {});
      expect(result).toBe('\0virtual:dualabs-docs/openapi');
    });

    it('returns undefined for unknown ids', () => {
      const result = (plugin.resolveId as Function)('some-other-module', undefined, {});
      expect(result).toBeUndefined();
    });
  });

  describe('manifest virtual module', () => {
    it('returns JS source for manifest id', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/manifest');
      expect(typeof source).toBe('string');
      expect(source).toContain('export default');
    });

    it('contains exactly 3 entries', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/manifest') as string;
      const entries = extractDefault(source) as DocEntry[];
      expect(entries).toHaveLength(3);
    });

    it('getting-started entry has correct section and slug', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/manifest') as string;
      const entries = extractDefault(source) as DocEntry[];
      const entry = entries.find((e) => e.slug === 'getting-started');
      expect(entry).toBeDefined();
      expect(entry?.section).toBe('getting-started');
      expect(entry?.order).toBe(0);
      expect(entry?.type).toBe('tutorial');
      expect(entry?.title).toBe('Getting Started');
    });

    it('webhooks-101 entry has section concepts', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/manifest') as string;
      const entries = extractDefault(source) as DocEntry[];
      const entry = entries.find((e) => e.slug === 'webhooks-101');
      expect(entry).toBeDefined();
      expect(entry?.section).toBe('concepts');
      expect(entry?.type).toBe('explanation');
      expect(entry?.order).toBe(1);
    });

    it('send-first-event entry has section guides', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/manifest') as string;
      const entries = extractDefault(source) as DocEntry[];
      const entry = entries.find((e) => e.slug === 'send-first-event');
      expect(entry).toBeDefined();
      expect(entry?.section).toBe('guides');
      expect(entry?.type).toBe('how-to');
    });

    it('entries do not contain raw field', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/manifest') as string;
      const entries = extractDefault(source) as DocEntry[];
      for (const entry of entries) {
        expect(entry).not.toHaveProperty('raw');
      }
    });
  });

  describe('openapi virtual module', () => {
    it('returns parsed OpenAPI object', () => {
      const source = (plugin.load as Function)('\0virtual:dualabs-docs/openapi') as string;
      const spec = extractDefault(source) as Record<string, unknown>;
      expect(spec).not.toBeNull();
      expect(spec?.['openapi']).toBe('3.0.3');
      expect((spec?.['info'] as Record<string, unknown>)?.['title']).toBe('Product API');
    });
  });

  describe('missing openapi.yaml', () => {
    it('exposes null when openapi.yaml is absent', () => {
      const pluginNoApi = dualabsDocsSource({ apiRepoPath: '/nonexistent/path' });
      const source = (pluginNoApi.load as Function)('\0virtual:dualabs-docs/openapi') as string;
      const spec = extractDefault(source);
      expect(spec).toBeNull();
    });
  });

  describe('load', () => {
    it('returns undefined for unknown ids', () => {
      const result = (plugin.load as Function)('\0some-other-id');
      expect(result).toBeUndefined();
    });
  });
});
