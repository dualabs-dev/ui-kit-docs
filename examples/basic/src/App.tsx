/**
 * Minimal example showing how to wire up @dualabs-dev/ui-kit-docs in a docs site.
 *
 * In a real docs site:
 * - The Vite plugin (dualabsDocsSource) populates the virtual modules.
 * - Routes are generated from the manifest entries.
 * - MDX pages are rendered inside <MdxRenderer>.
 *
 * This example uses a static fake manifest to keep it self-contained.
 */
import React from 'react';
import { DocsLayout, MdxRenderer, VersionSelector } from '@dualabs-dev/ui-kit-docs/components';

export default function App(): React.JSX.Element {
  const [version, setVersion] = React.useState('api-example-2025-01-15');

  return (
    <DocsLayout
      productName="Example Product"
      basePath="/docs"
      versionSelector={
        <VersionSelector
          repo="dualabs-dev/example"
          current={version}
          onChange={setVersion}
        />
      }
    >
      <MdxRenderer>
        <h1>Getting Started</h1>
        <p>
          This is a minimal example of a docs site built with{' '}
          <code>@dualabs-dev/ui-kit-docs</code>.
        </p>
        <p>
          In a real docs site, this content would come from an MDX file compiled
          by the <code>@mdx-js/rollup</code> Vite plugin.
        </p>
        <h2>Installation</h2>
        <pre>
          <code>npm install @dualabs-dev/ui-kit-docs</code>
        </pre>
      </MdxRenderer>
    </DocsLayout>
  );
}
