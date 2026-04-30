import React, { type ReactNode, useState } from 'react';
import { cn } from '@dualabs-dev/ui-kit';
import { DocsSidebar } from './DocsSidebar';

export interface DocsLayoutProps {
  children: ReactNode;
  logo?: ReactNode;
  productName: string;
  basePath?: string;
  versionSelector?: ReactNode;
}

export function DocsLayout({
  children,
  logo,
  productName,
  basePath = '/docs',
  versionSelector,
}: DocsLayoutProps): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn('flex min-h-screen flex-col bg-background text-foreground')}>
      <Header
        logo={logo}
        productName={productName}
        versionSelector={versionSelector}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto border-r border-border bg-card pt-16 transition-transform duration-200 md:static md:translate-x-0 md:pt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <DocsSidebar basePath={basePath} />
        </aside>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

interface HeaderProps {
  logo?: ReactNode;
  productName: string;
  versionSelector?: ReactNode;
  onMenuToggle: () => void;
}

function Header({ logo, productName, versionSelector, onMenuToggle }: HeaderProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-8">
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={onMenuToggle}
        className="rounded p-1 hover:bg-muted md:hidden"
      >
        <span className="block h-0.5 w-5 bg-foreground" />
        <span className="mt-1 block h-0.5 w-5 bg-foreground" />
        <span className="mt-1 block h-0.5 w-5 bg-foreground" />
      </button>
      <div className="flex items-center gap-2">
        {logo}
        <span className="font-semibold">{productName}</span>
      </div>
      <div className="ml-auto">{versionSelector}</div>
    </header>
  );
}
