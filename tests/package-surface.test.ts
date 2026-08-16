import {readFile} from 'node:fs/promises';

import {describe, expect, it} from 'vitest';

describe('package surface', () => {
  it('encapsulates the accepted four public subpaths', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
      dependencies: Record<string, string>;
      engines: Record<string, string>;
      exports: Record<string, unknown>;
      peerDependencies: Record<string, string>;
    };

    expect(Object.keys(packageJson.exports)).toEqual([
      '.',
      './styles.css',
      './manifest.json',
      './agent-index.md',
    ]);
    expect(packageJson.peerDependencies).toEqual({
      react: '^18.3.1 || ^19.0.0',
      'react-dom': '^18.3.1 || ^19.0.0',
    });
    expect(packageJson.dependencies['react-aria-components']).toBe('1.20.0');
    expect(packageJson.peerDependencies).not.toHaveProperty('react-aria-components');
    expect(packageJson.engines.node).toBe('>=22.12.0');
  });
});
