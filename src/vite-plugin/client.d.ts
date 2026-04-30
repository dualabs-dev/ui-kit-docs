/**
 * Virtual module type declarations for consumers of @dualabs-dev/ui-kit-docs.
 *
 * Add this file to your tsconfig.json `include` array, or reference it with:
 *   /// <reference types="@dualabs-dev/ui-kit-docs/vite-plugin/client" />
 *
 * Usage example in a docs site:
 *
 *   import manifest from 'virtual:dualabs-docs/manifest';
 *   import openapi from 'virtual:dualabs-docs/openapi';
 */

import type { DocEntry } from './types';

declare module 'virtual:dualabs-docs/manifest' {
  const manifest: DocEntry[];
  export default manifest;
}

declare module 'virtual:dualabs-docs/openapi' {
  const openapi: Record<string, unknown> | null;
  export default openapi;
}
