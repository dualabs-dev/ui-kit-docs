import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// DocsSidebar uses useLocation — mock it before importing DocsLayout
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/docs' }),
}));

import { DocsLayout } from '../DocsLayout';

describe('DocsLayout', () => {
  it('renders product name in header', () => {
    render(
      <DocsLayout productName="OnCall">
        <p>Content</p>
      </DocsLayout>,
    );
    expect(screen.getByText('OnCall')).toBeInTheDocument();
  });

  it('renders children in main area', () => {
    render(
      <DocsLayout productName="OnCall">
        <p>Hello docs</p>
      </DocsLayout>,
    );
    expect(screen.getByText('Hello docs')).toBeInTheDocument();
  });

  it('renders optional logo', () => {
    render(
      <DocsLayout productName="OnCall" logo={<span data-testid="logo">Logo</span>}>
        <p>Content</p>
      </DocsLayout>,
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders version selector slot', () => {
    render(
      <DocsLayout
        productName="OnCall"
        versionSelector={<span data-testid="version">v1</span>}
      >
        <p>Content</p>
      </DocsLayout>,
    );
    expect(screen.getByTestId('version')).toBeInTheDocument();
  });

  it('renders menu toggle button for mobile', () => {
    render(
      <DocsLayout productName="OnCall">
        <p>Content</p>
      </DocsLayout>,
    );
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
  });
});
