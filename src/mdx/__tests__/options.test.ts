import { describe, it, expect } from 'vitest';
import { dualabsMdxOptions } from '../index';

describe('dualabsMdxOptions', () => {
  it('returns non-empty rehypePlugins array', () => {
    const config = dualabsMdxOptions();
    expect(config.rehypePlugins).toBeDefined();
    expect(Array.isArray(config.rehypePlugins)).toBe(true);
    expect(config.rehypePlugins.length).toBeGreaterThan(0);
  });

  it('returns remarkPlugins as an array', () => {
    const config = dualabsMdxOptions();
    expect(config.remarkPlugins).toBeDefined();
    expect(Array.isArray(config.remarkPlugins)).toBe(true);
  });

  it('applies default themes when no options provided', () => {
    const config = dualabsMdxOptions();
    const [, pluginOptions] = config.rehypePlugins[0] as [unknown, { themes: { light: string; dark: string } }];
    expect(pluginOptions.themes.light).toBe('github-light');
    expect(pluginOptions.themes.dark).toBe('github-dark');
  });

  it('applies custom themes when provided', () => {
    const config = dualabsMdxOptions({ themes: { light: 'solarized-light', dark: 'solarized-dark' } });
    const [, pluginOptions] = config.rehypePlugins[0] as [unknown, { themes: { light: string; dark: string } }];
    expect(pluginOptions.themes.light).toBe('solarized-light');
    expect(pluginOptions.themes.dark).toBe('solarized-dark');
  });
});
