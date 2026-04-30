/**
 * Ambient declarations for virtual modules emitted by the dualabsDocsSource Vite plugin.
 * No imports here — this must be a global script-context declaration file so that
 * TypeScript treats it as ambient (not a module), enabling module augmentation.
 */

declare module 'virtual:dualabs-docs/manifest' {
  type DocSection = 'getting-started' | 'concepts' | 'guides';
  type DocType = 'tutorial' | 'explanation' | 'how-to' | 'reference';
  interface DocEntry {
    slug: string;
    title: string;
    section: DocSection;
    order: number;
    type: DocType;
    filePath: string;
  }
  const entries: DocEntry[];
  export default entries;
}

declare module 'virtual:dualabs-docs/openapi' {
  const spec: object | null;
  export default spec;
}
