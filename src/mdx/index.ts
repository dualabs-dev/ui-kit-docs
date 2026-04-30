import rehypeShiki, { type RehypeShikiOptions } from '@shikijs/rehype';
import type { PluggableList } from 'unified';

export interface MdxThemes {
  light: string;
  dark: string;
}

export interface MdxOptions {
  themes?: MdxThemes;
}

export interface MdxPluginConfig {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
}

const DEFAULT_THEMES: MdxThemes = {
  light: 'github-light',
  dark: 'github-dark',
};

export function dualabsMdxOptions(options?: MdxOptions): MdxPluginConfig {
  const themes = options?.themes ?? DEFAULT_THEMES;

  const rehypeShikiOptions: RehypeShikiOptions = {
    themes: {
      light: themes.light,
      dark: themes.dark,
    },
    defaultColor: false,
    lazy: true,
  };

  return {
    remarkPlugins: [],
    rehypePlugins: [[rehypeShiki, rehypeShikiOptions]],
  };
}
