import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { VersionSelector } from '../VersionSelector';

const MOCK_TAGS = [
  { name: 'api-oncall-2025-01-15' },
  { name: 'api-oncall-2024-12-01' },
  { name: 'some-other-tag' },
];

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_TAGS),
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('VersionSelector', () => {
  it('renders null when no matching tags', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{ name: 'unrelated-tag' }]),
      }),
    );
    const { container } = render(
      <VersionSelector repo="dualabs-dev/api-oncall" current="" onChange={() => {}} />,
    );
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders a select when matching tags exist', async () => {
    render(
      <VersionSelector
        repo="dualabs-dev/api-oncall"
        current="api-oncall-2025-01-15"
        onChange={() => {}}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    expect(screen.getByRole('option', { name: 'api-oncall-2025-01-15' })).toBeInTheDocument();
    // filters out "some-other-tag"
    expect(screen.queryByRole('option', { name: 'some-other-tag' })).not.toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const onChange = vi.fn();
    render(
      <VersionSelector
        repo="dualabs-dev/api-oncall"
        current="api-oncall-2025-01-15"
        onChange={onChange}
      />,
    );
    await waitFor(() => screen.getByRole('combobox'));
    await userEvent.selectOptions(screen.getByRole('combobox'), 'api-oncall-2024-12-01');
    expect(onChange).toHaveBeenCalledWith('api-oncall-2024-12-01');
  });

  it('passes Authorization header when token is provided', async () => {
    render(
      <VersionSelector
        repo="dualabs-dev/api-oncall"
        current=""
        onChange={() => {}}
        token="ghp_test"
      />,
    );
    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('api.github.com'),
        expect.objectContaining({ headers: { Authorization: 'Bearer ghp_test' } }),
      );
    });
  });
});
