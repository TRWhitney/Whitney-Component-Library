import {describe, expect, it} from 'vitest';

import {
  appearanceProviderContract,
  renderAgentIndex,
  renderContractDocumentation,
  renderTypeScriptExamples,
  toComponentManifest,
  validateComponentContracts,
  type ComponentContract,
} from '../src/contracts/index.js';

describe('canonical component contracts', () => {
  it('derives human and machine guidance from the provider contract', () => {
    const contracts = validateComponentContracts([appearanceProviderContract], [
      'AppearanceProvider',
    ]);

    expect(toComponentManifest(contracts)).toMatchObject({
      schemaVersion: 1,
      exports: [{name: 'AppearanceProvider', kind: 'provider'}],
    });
    expect(renderAgentIndex(contracts)).toContain(
      'AppearanceProvider: Scope appearance and one application accent',
    );
    expect(
      renderContractDocumentation(appearanceProviderContract, 'component-library-under-test'),
    ).toContain(
      '## Do not use for',
    );
  });

  it('rejects a contract with missing required guidance', () => {
    const incomplete = {
      ...appearanceProviderContract,
      inappropriateUses: [],
    } satisfies ComponentContract;

    expect(() => validateComponentContracts([incomplete], ['AppearanceProvider'])).toThrow(
      /inappropriateUses/i,
    );
  });

  it('rejects guidance arrays that contain only blank text', () => {
    const incomplete = {
      ...appearanceProviderContract,
      states: ['   '],
    } satisfies ComponentContract;

    expect(() => validateComponentContracts([incomplete], ['AppearanceProvider'])).toThrow(
      /states/i,
    );
  });

  it.each([
    'accentBehavior',
    'controlBehavior',
    'directionality',
    'events',
    'formBehavior',
    'forcedColorBehavior',
    'keyboardBehavior',
    'labeling',
    'localization',
    'parts',
    'preferredCompositions',
    'reducedMotionBehavior',
    'validation',
  ] as const)('rejects missing %s guidance', (field) => {
    const incomplete = {
      ...appearanceProviderContract,
      [field]: [],
    } as unknown as ComponentContract;

    expect(() => validateComponentContracts([incomplete], ['AppearanceProvider'])).toThrow(
      new RegExp(field, 'i'),
    );
  });

  it('rejects a contract that names an export outside the public root', () => {
    const invalidReference = {
      ...appearanceProviderContract,
      relatedExports: ['ThemeTokens'],
    } satisfies ComponentContract;

    expect(() => validateComponentContracts([invalidReference], ['AppearanceProvider'])).toThrow(
      /ThemeTokens.*public export/i,
    );
  });

  it('rejects a public export without exactly one canonical contract', () => {
    expect(() => validateComponentContracts([], ['AppearanceProvider'])).toThrow(
      /AppearanceProvider.*canonical contract/i,
    );

    const duplicate = {
      ...appearanceProviderContract,
      name: 'ApplicationAppearanceProvider',
    } satisfies ComponentContract;
    expect(() =>
      validateComponentContracts(
        [appearanceProviderContract, duplicate],
        ['AppearanceProvider'],
      ),
    ).toThrow(/AppearanceProvider.*more than one/i);
  });

  it('renders the canonical examples as the TypeScript verification source', () => {
    const source = renderTypeScriptExamples(
      [appearanceProviderContract],
      '@fixture/component-library',
    );

    expect(source).toContain("from '@fixture/component-library'");
    expect(source).toContain(appearanceProviderContract.examples[0]!.code);
    expect(source).toContain(appearanceProviderContract.counterExamples[0]!.code);
  });

  it('documents the explicit static stylesheet entry', () => {
    const documentation = renderContractDocumentation(
      appearanceProviderContract,
      '@fixture/component-library',
    );

    expect(documentation).toContain("import '@fixture/component-library/styles.css';");
    expect(documentation).toContain('## Control, events, validation, and forms');
    expect(documentation).toContain('## Keyboard, labeling, localization, and direction');
    expect(documentation).toContain('## Accent, forced colors, and reduced motion');
  });
});
