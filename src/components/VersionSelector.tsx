import React, { useEffect, useState } from 'react';
import { cn } from '@dualabs-dev/ui-kit';

const TAG_PATTERN = /^api-[a-z0-9-]+-\d{4}-\d{2}-\d{2}$/;

interface GitHubTag {
  name: string;
}

export interface VersionSelectorProps {
  /** GitHub repo in `owner/name` format. */
  repo: string;
  current: string;
  onChange: (version: string) => void;
  /** Optional GitHub token for higher rate limits. */
  token?: string;
}

export function VersionSelector({
  repo,
  current,
  onChange,
  token,
}: VersionSelectorProps): React.JSX.Element | null {
  const tags = useTags(repo, token);

  if (tags.length === 0) return null;

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select version"
      className={cn(
        'rounded border border-border bg-card px-2 py-1 text-sm text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring',
      )}
    >
      {tags.map((tag) => (
        <option key={tag} value={tag}>
          {tag}
        </option>
      ))}
    </select>
  );
}

function useTags(repo: string, token?: string): string[] {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`https://api.github.com/repos/${repo}/tags`, {
      headers,
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: GitHubTag[]) => {
        const filtered = data
          .map((t) => t.name)
          .filter((n) => TAG_PATTERN.test(n))
          .sort()
          .reverse();
        setTags(filtered);
      })
      .catch(() => {
        /* network error or abort — stay silent */
      });

    return () => controller.abort();
  }, [repo, token]);

  return tags;
}
