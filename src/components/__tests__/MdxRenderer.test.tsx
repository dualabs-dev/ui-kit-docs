import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { MdxRenderer } from '../MdxRenderer';

describe('MdxRenderer', () => {
  it('renders children inside an article element', () => {
    render(
      <MdxRenderer>
        <p>Hello world</p>
      </MdxRenderer>,
    );
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent('Hello world');
  });

  it('wraps content in a prose container', () => {
    const { container } = render(
      <MdxRenderer>
        <h1>Title</h1>
      </MdxRenderer>,
    );
    // prose class is applied via cn
    expect(container.querySelector('article')).toBeTruthy();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
