# examples/basic

Minimal example wiring `@dualabs-dev/ui-kit-docs` into a Vite + React app.

## What it shows

- `DocsLayout` with sidebar, header, and version selector slot
- `MdxRenderer` wrapping static content (in real usage: MDX compiled modules)
- `VersionSelector` fetching GitHub tags

## Run it

```bash
npm install
npm run dev
```

The example expects a Vite config that:
1. Includes `dualabsDocsSource({ apiRepoPath: '../../..' })` from `@dualabs-dev/ui-kit-docs/vite-plugin`
2. Includes `@mdx-js/rollup` for MDX file compilation

See the root README for the full wiring guide.
