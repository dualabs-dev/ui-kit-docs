import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Pagefind is a runtime bundle — stub the import in unit tests
vi.mock('@pagefind/default-ui', () => ({
  PagefindUI: vi.fn(),
}));

import { DocsSearch } from '../DocsSearch';

describe('DocsSearch', () => {
  it('renders the search trigger button', () => {
    render(<DocsSearch />);
    expect(screen.getByRole('button', { name: /search documentation/i })).toBeInTheDocument();
  });

  it('opens the modal on button click', () => {
    render(<DocsSearch />);
    fireEvent.click(screen.getByRole('button', { name: /search documentation/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the modal on Escape key', () => {
    render(<DocsSearch />);
    fireEvent.click(screen.getByRole('button', { name: /search documentation/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the modal on Cmd+K', () => {
    render(<DocsSearch />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the modal on backdrop click', () => {
    render(<DocsSearch />);
    fireEvent.click(screen.getByRole('button', { name: /search documentation/i }));
    const dialog = screen.getByRole('dialog');
    // click the backdrop (the dialog element itself, not the inner box)
    fireEvent.click(dialog);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
