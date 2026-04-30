import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/docs/getting-started/installation' }),
}));

import { DocsSidebar } from '../DocsSidebar';

describe('DocsSidebar', () => {
  it('renders section headings', () => {
    render(<DocsSidebar />);
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Concepts')).toBeInTheDocument();
    expect(screen.getByText('Guides')).toBeInTheDocument();
  });

  it('renders all doc entries as links', () => {
    render(<DocsSidebar basePath="/docs" />);
    expect(screen.getByRole('link', { name: 'Installation' })).toHaveAttribute(
      'href',
      '/docs/getting-started/installation',
    );
    expect(screen.getByRole('link', { name: 'Webhooks 101' })).toHaveAttribute(
      'href',
      '/docs/concepts/webhooks',
    );
  });

  it('marks the active route with aria-current=page', () => {
    render(<DocsSidebar basePath="/docs" />);
    const activeLink = screen.getByRole('link', { name: 'Installation' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark non-active routes', () => {
    render(<DocsSidebar basePath="/docs" />);
    const inactiveLink = screen.getByRole('link', { name: 'Webhooks 101' });
    expect(inactiveLink).not.toHaveAttribute('aria-current');
  });
});
