/// <reference path="../virtual-modules.d.ts" />
import React from 'react';
import { useLocation } from '@tanstack/react-router';
import { cn } from '@dualabs-dev/ui-kit';
import entries from 'virtual:dualabs-docs/manifest';
import type { DocSection, DocEntry } from './types';

export interface DocsSidebarProps {
  basePath?: string;
}

const SECTION_ORDER: DocSection[] = ['getting-started', 'concepts', 'guides'];

const SECTION_LABELS: Record<DocSection, string> = {
  'getting-started': 'Getting Started',
  concepts: 'Concepts',
  guides: 'Guides',
};

function groupEntries(items: DocEntry[]): Map<DocSection, DocEntry[]> {
  const groups = new Map<DocSection, DocEntry[]>(
    SECTION_ORDER.map((s) => [s, []]),
  );
  for (const entry of items) {
    groups.get(entry.section)?.push(entry);
  }
  for (const [, list] of groups) {
    list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }
  return groups;
}

export function DocsSidebar({ basePath = '/docs' }: DocsSidebarProps): React.JSX.Element {
  const location = useLocation();
  const groups = groupEntries(entries);

  return (
    <nav aria-label="Documentation navigation" className="p-4">
      {SECTION_ORDER.map((section) => {
        const items = groups.get(section) ?? [];
        if (items.length === 0) return null;
        return (
          <SectionGroup
            key={section}
            label={SECTION_LABELS[section]}
            items={items}
            basePath={basePath}
            currentPath={location.pathname}
          />
        );
      })}
    </nav>
  );
}

interface SectionGroupProps {
  label: string;
  items: DocEntry[];
  basePath: string;
  currentPath: string;
}

function SectionGroup({ label, items, basePath, currentPath }: SectionGroupProps): React.JSX.Element {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((entry) => {
          const href = `${basePath}/${entry.slug}`;
          const isActive = currentPath === href;
          return (
            <li key={entry.slug}>
              <a
                href={href}
                className={cn(
                  'block rounded px-2 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-foreground hover:bg-muted',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {entry.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
