import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';

// Mock Scalar — heavy Vue dependency, not needed in unit tests.
// The mock is synchronous so Suspense resolves immediately (no fallback shown).
vi.mock('@scalar/api-reference-react', () => ({
  ApiReferenceReact: ({ configuration }: { configuration: object }) => (
    <div data-testid="scalar" data-config={JSON.stringify(configuration)} />
  ),
}));

// Mock virtual module
vi.mock('virtual:dualabs-docs/openapi', () => ({
  default: { openapi: '3.0.0', info: { title: 'Mock API', version: '1.0.0' }, paths: {} },
}));

import { ApiReference } from '../ApiReference';

describe('ApiReference', () => {
  it('renders the Scalar component after lazy resolution', async () => {
    render(<ApiReference />);
    await waitFor(() => expect(screen.getByTestId('scalar')).toBeInTheDocument());
  });

  it('passes spec override in configuration', async () => {
    const spec = { openapi: '3.1.0', info: { title: 'Override', version: '2.0.0' }, paths: {} };
    render(<ApiReference spec={spec} />);
    await waitFor(() => {
      const el = screen.getByTestId('scalar');
      const config = JSON.parse(el.getAttribute('data-config') ?? '{}') as {
        spec?: { content: object };
      };
      expect(config.spec?.content).toMatchObject({ info: { title: 'Override' } });
    });
  });
});
