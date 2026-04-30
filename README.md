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

## Context

See the platform repo's `docs/project/plan-tracker.md` (P0 — docs sites
infrastructure) for the broader plan and how this package fits in.
