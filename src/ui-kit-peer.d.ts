/**
 * Stub type declarations for the @dualabs-dev/ui-kit peer dependency.
 * The real package is consumed at runtime by the host app; this file
 * satisfies the TypeScript compiler during library build without requiring
 * the peer to be installed.
 */
declare module '@dualabs-dev/ui-kit' {
  import type { ClassValue } from 'clsx';

  export function cn(...inputs: ClassValue[]): string;

  export const COLOR_TOKENS: readonly [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'tertiary',
    'tertiary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'success',
    'success-foreground',
    'warning',
    'warning-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
  ];

  export type ColorToken = (typeof COLOR_TOKENS)[number];
}
