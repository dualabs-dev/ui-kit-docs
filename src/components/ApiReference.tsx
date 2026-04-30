import React, { lazy, Suspense } from 'react';
import type { AnyApiReferenceConfiguration } from '@scalar/types/api-reference';

// Lazy-load Scalar to keep the initial bundle small.
const ApiReferenceReact = lazy(() =>
  import('@scalar/api-reference-react').then((m) => ({ default: m.ApiReferenceReact })),
);

export type ScalarConfig = AnyApiReferenceConfiguration;

export interface ApiReferenceProps {
  /** Override the OpenAPI spec. Defaults to the virtual module value. */
  spec?: object;
  /** Partial Scalar configuration merged on top of defaults. */
  configuration?: Partial<AnyApiReferenceConfiguration>;
}

export function ApiReference({ spec, configuration }: ApiReferenceProps): React.JSX.Element {
  const resolvedSpec = resolveSpec(spec);
  const specConfig = resolvedSpec !== null ? { spec: { content: resolvedSpec } } : {};
  const config = { ...configuration, ...specConfig } as AnyApiReferenceConfiguration;

  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading API reference...</div>}>
      <ApiReferenceReact configuration={config} />
    </Suspense>
  );
}

function resolveSpec(override?: object): object | null {
  if (override !== undefined) return override;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('virtual:dualabs-docs/openapi') as { default: object | null };
    return mod.default;
  } catch {
    return null;
  }
}
