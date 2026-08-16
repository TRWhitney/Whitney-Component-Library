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
});
