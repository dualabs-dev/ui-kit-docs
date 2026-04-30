import type { DocEntry } from '../../types';

const entries: DocEntry[] = [
  {
    slug: 'getting-started/installation',
    title: 'Installation',
    section: 'getting-started',
    order: 1,
    type: 'tutorial',
    filePath: 'docs/functional/getting-started.md',
  },
  {
    slug: 'concepts/webhooks',
    title: 'Webhooks 101',
    section: 'concepts',
    order: 1,
    type: 'explanation',
    filePath: 'docs/functional/concepts/webhooks-101.md',
  },
  {
    slug: 'guides/first-alert',
    title: 'Create your first alert',
    section: 'guides',
    order: 1,
    type: 'how-to',
    filePath: 'docs/functional/guides/first-alert.md',
  },
];

export default entries;
