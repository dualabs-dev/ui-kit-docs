# @dualabs-dev/ui-kit-docs

Docs sites layer for the Dualabs galaxy. Powers every `docs.<product>.dev` site
with a Vite source plugin (MDX guides + OpenAPI loader) and a set of React
components (navigation, MDX renderer, Scalar-based API reference) on top of
`@dualabs-dev/ui-kit`.

## Installation

```bash
npm install @dualabs-dev/ui-kit-docs @dualabs-dev/ui-kit
```

## Exports

- `@dualabs-dev/ui-kit-docs` — root entry, re-exports plugin + components
- `@dualabs-dev/ui-kit-docs/vite-plugin` — `dualabsDocsSource()` Vite plugin
  that loads MDX guides and the product's `openapi.yaml`
- `@dualabs-dev/ui-kit-docs/components` — React components (sidebar, MDX
  provider, API reference)
- `@dualabs-dev/ui-kit-docs/css` — base styles

## Build

```bash
npm install
npm run build
```

## Vite plugin

`dualabsDocsSource({ apiRepoPath })` ingests Markdown guides and an OpenAPI spec
from a product API repo at build time and exposes two virtual modules to the
consuming docs site.

```ts
// vite.config.ts (in a docs.<product>.dev site)
import { defineConfig } from 'vite';
import { dualabsDocsSource } from '@dualabs-dev/ui-kit-docs/vite-plugin';
import path from 'node:path';

export default defineConfig({
  plugins: [
    dualabsDocsSource({
      // Absolute path to the product API repo on this machine
      apiRepoPath: path.resolve(__dirname, '../../apis/products/one-response'),
    }),
  ],
});
```

Then import in your app:

```ts
// Add to tsconfig.json "include": ["node_modules/@dualabs-dev/ui-kit-docs/src/vite-plugin/client.d.ts"]
import manifest from 'virtual:dualabs-docs/manifest'; // DocEntry[]
import openapi from 'virtual:dualabs-docs/openapi';   // parsed OpenAPI object | null
```

The plugin globs `docs/functional/**/*.md` (frontmatter: `title`, `order`, `type`)
and reads `docs/api/openapi.yaml`. It watches for changes in dev mode and
triggers a full page reload on any `.md` or `.yaml` edit under `docs/`.

### MDX + syntax highlighting

`dualabsMdxOptions()` from `@dualabs-dev/ui-kit-docs/mdx` returns a
`{ remarkPlugins, rehypePlugins }` config that wires `@shikijs/rehype` with
dual-theme (light + dark) support. Pass it to `@mdx-js/rollup` in your
`vite.config.ts`:

```ts
// vite.config.ts (in a docs.<product>.dev site)
import { defineConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import { dualabsDocsSource } from '@dualabs-dev/ui-kit-docs/vite-plugin';
import { dualabsMdxOptions } from '@dualabs-dev/ui-kit-docs/mdx';
import path from 'node:path';

export default defineConfig({
  plugins: [
    mdx(dualabsMdxOptions()),
    // Custom themes (optional — defaults: github-light / github-dark):
    // mdx(dualabsMdxOptions({ themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } })),
    dualabsDocsSource({
      apiRepoPath: path.resolve(__dirname, '../../apis/products/one-response'),
    }),
  ],
});
```

Code blocks in MDX files are highlighted at compile time. The generated HTML
sets `data-theme` attributes for both themes; pair with the shiki CSS variables
strategy or a `[data-theme]` selector in your styles to switch on dark mode.

## Example

See [`examples/basic/`](./examples/basic/) for a minimal working app that mounts
`<DocsLayout>` with a fake manifest. Run it with:

```bash
cd examples/basic
npm install
npm run dev
```

## Context

See the platform repo's `docs/project/plan-tracker.md` (P0 — docs sites
infrastructure) for the broader plan and how this package fits in.
