import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { Plugin, ViteDevServer } from 'vite';

export type { DocEntry, DocSection, DocType, DualabsDocsSourceOptions } from './types';
import type { DocEntry, DocEntryWithRaw, DocSection, DocType, DualabsDocsSourceOptions } from './types';

const MANIFEST_ID = 'virtual:dualabs-docs/manifest';
const OPENAPI_ID = 'virtual:dualabs-docs/openapi';
const RESOLVED_MANIFEST = `\0${MANIFEST_ID}`;
const RESOLVED_OPENAPI = `\0${OPENAPI_ID}`;

const SECTION_TYPE_MAP: Record<DocSection, DocType> = {
  'getting-started': 'tutorial',
  'concepts': 'explanation',
  'guides': 'how-to',
};

const VALID_SECTIONS = new Set<DocSection>(['getting-started', 'concepts', 'guides']);

function inferSection(filePath: string, functionalBase: string): DocSection {
  const rel = path.relative(functionalBase, filePath);
  const segment = rel.split(path.sep)[0] as string;
  if (segment && VALID_SECTIONS.has(segment as DocSection)) {
    return segment as DocSection;
  }
  return 'getting-started';
}

function parseEntry(filePath: string, functionalBase: string): DocEntryWithRaw {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const section = inferSection(filePath, functionalBase);
  const slug = path.basename(filePath, path.extname(filePath));
  const order = typeof data['order'] === 'number' ? data['order'] : 0;
  const title = typeof data['title'] === 'string' ? data['title'] : slug;
  const type: DocType =
    typeof data['type'] === 'string' && ['tutorial', 'explanation', 'how-to', 'reference'].includes(data['type'])
      ? (data['type'] as DocType)
      : SECTION_TYPE_MAP[section];

  return { slug, title, section, order, type, filePath, raw: content };
}

function loadManifest(apiRepoPath: string): DocEntry[] {
  const functionalBase = path.join(apiRepoPath, 'docs', 'functional');
  const pattern = path.join(functionalBase, '**', '*.md').replace(/\\/g, '/');
  const files = glob.sync(pattern);
  return files
    .map((f) => parseEntry(f, functionalBase))
    .map(({ raw: _raw, ...entry }) => entry);
}

function loadOpenApi(apiRepoPath: string): unknown {
  const openapiPath = path.join(apiRepoPath, 'docs', 'api', 'openapi.yaml');
  if (!fs.existsSync(openapiPath)) {
    console.warn(`[dualabs-docs-source] openapi.yaml not found at ${openapiPath} — exposing null`);
    return null;
  }
  const raw = fs.readFileSync(openapiPath, 'utf-8');
  return yaml.load(raw);
}

export function dualabsDocsSource(options: DualabsDocsSourceOptions): Plugin {
  const { apiRepoPath } = options;

  return {
    name: 'dualabs-docs-source',

    resolveId(id: string): string | undefined {
      if (id === MANIFEST_ID) return RESOLVED_MANIFEST;
      if (id === OPENAPI_ID) return RESOLVED_OPENAPI;
      return undefined;
    },

    load(id: string): string | undefined {
      if (id === RESOLVED_MANIFEST) {
        const entries = loadManifest(apiRepoPath);
        return `export default ${JSON.stringify(entries, null, 2)};`;
      }
      if (id === RESOLVED_OPENAPI) {
        const spec = loadOpenApi(apiRepoPath);
        return `export default ${JSON.stringify(spec, null, 2)};`;
      }
      return undefined;
    },

    configureServer(server: ViteDevServer): void {
      const watchPattern = path.join(apiRepoPath, 'docs', '**', '*.{md,yaml}');
      server.watcher.add(watchPattern);
      server.watcher.on('change', (file: string) => {
        if (!file.startsWith(path.join(apiRepoPath, 'docs'))) return;
        const manifestMod = server.moduleGraph.getModuleById(RESOLVED_MANIFEST);
        const openapiMod = server.moduleGraph.getModuleById(RESOLVED_OPENAPI);
        if (manifestMod) server.moduleGraph.invalidateModule(manifestMod);
        if (openapiMod) server.moduleGraph.invalidateModule(openapiMod);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
