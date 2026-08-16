import {describe, expect, it} from 'vitest';

import {findUnexpectedGeneratedDocumentation} from '../scripts/generated-documentation.mjs';

describe('generated component documentation', () => {
  it('identifies Markdown pages that no longer have a canonical contract', () => {
    expect(
      findUnexpectedGeneratedDocumentation(
        ['appearance-provider.md', 'removed-component.md', 'notes.txt'],
        ['appearance-provider.md'],
      ),
    ).toEqual(['removed-component.md']);
  });
});
