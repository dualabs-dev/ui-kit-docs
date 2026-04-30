/**
 * Minimal ambient declaration for @pagefind/default-ui.
 * The package ships no TypeScript types — we declare only what we use.
 */
declare module '@pagefind/default-ui' {
  interface PagefindUIOptions {
    element: HTMLElement;
    baseUrl?: string;
    showSubResults?: boolean;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
}
