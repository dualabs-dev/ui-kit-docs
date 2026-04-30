import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@dualabs-dev/ui-kit';

export interface DocsSearchProps {
  /** Base URL where the pagefind bundle is served. */
  pagefindBaseUrl?: string;
}

/**
 * Search modal triggered by Cmd/Ctrl+K.
 * Lazily initialises @pagefind/default-ui inside an iframe-like container so the
 * pagefind CSS is scoped and does not leak into the host page.
 */
export function DocsSearch({ pagefindBaseUrl = '/pagefind/' }: DocsSearchProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    let cancelled = false;

    import('@pagefind/default-ui')
      .then(({ PagefindUI }) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        new PagefindUI({
          element: containerRef.current,
          baseUrl: pagefindBaseUrl,
          showSubResults: true,
        });
      })
      .catch(() => {
        /* pagefind bundle missing in dev — silent */
      });

    return () => {
      cancelled = true;
    };
  }, [open, pagefindBaseUrl]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className={cn(
          'flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground',
          'hover:border-primary/50 transition-colors',
        )}
      >
        <SearchIcon />
        <span>Search</span>
        <kbd className="ml-auto hidden rounded bg-background px-1.5 py-0.5 text-xs md:inline">
          Cmd K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 pt-[10vh]"
          onClick={close}
        >
          <div
            className={cn(
              'w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl',
              'overflow-hidden',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={containerRef} className="p-2" />
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon(): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
