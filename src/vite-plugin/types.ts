export type DocSection = 'getting-started' | 'concepts' | 'guides';

export type DocType = 'tutorial' | 'explanation' | 'how-to' | 'reference';

export interface DocEntry {
  slug: string;
  title: string;
  section: DocSection;
  order: number;
  type: DocType;
  filePath: string;
}

export interface DocEntryWithRaw extends DocEntry {
  raw: string;
}

export interface DualabsDocsSourceOptions {
  apiRepoPath: string;
}
