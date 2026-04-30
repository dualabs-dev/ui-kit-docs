export function cn(...args: unknown[]): string {
  return args.filter(Boolean).join(' ');
}

export const COLOR_TOKENS = [] as const;
