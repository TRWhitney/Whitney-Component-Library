import {describe, expect, it} from 'vitest';

import {createConsumerVerificationSource} from '../scripts/consumer-verification-source.mjs';

describe('packed consumer verification source', () => {
  it('captures server and hydration warnings before rendering starts', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');
    const serverRender = source.indexOf('renderToString(view)');

    expect(source.indexOf('console.error =', 0)).toBeLessThan(serverRender);
    expect(source.indexOf('console.warn =', 0)).toBeLessThan(serverRender);
    expect(source).toContain('SSR or hydration emitted warnings or recoverable errors.');
  });

  it('exercises the layout primitives through the packed public API', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of [
      'Divider',
      'InlineGroup',
      'ResponsiveGrid',
      'ScrollRegion',
      'Section',
      'Stack',
      'Surface',
    ]) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-responsive-grid');
    expect(source).toContain("label: 'Run history'");
  });
});
