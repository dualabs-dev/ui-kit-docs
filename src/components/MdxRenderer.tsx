import React, { type ReactNode } from 'react';
import { cn } from '@dualabs-dev/ui-kit';

export interface MdxRendererProps {
  children: ReactNode;
}

/**
 * Wraps MDX-compiled content in a prose container.
 * Syntax highlighting is applied at compile time via the rehype pipeline —
 * wire `dualabsMdxOptions()` from `@dualabs-dev/ui-kit-docs/mdx` into
 * `@mdx-js/rollup` in your `vite.config.ts`.
 */
export function MdxRenderer({ children }: MdxRendererProps): React.JSX.Element {
  return (
    <article
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-p:text-foreground/90',
        'prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm',
        'prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border',
      )}
    >
      {children}
    </article>
  );
}
