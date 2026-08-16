import {describe, expect, it} from 'vitest';

import {
  appearanceProviderContract,
  componentContracts,
  renderAgentIndex,
  renderContractDocumentation,
  renderTypeScriptExamples,
  toComponentManifest,
  validateComponentContracts,
  type ComponentContract,
} from '../src/contracts/index.js';

describe('canonical component contracts', () => {
  it('derives human and machine guidance from the provider contract', () => {
    const contracts = validateComponentContracts(
      [appearanceProviderContract],
      ['AppearanceProvider'],
    );

    expect(toComponentManifest(contracts)).toMatchObject({
      schemaVersion: 1,
      exports: [{name: 'AppearanceProvider', kind: 'provider'}],
    });
    expect(renderAgentIndex(contracts)).toContain(
      'AppearanceProvider: Scope appearance and one application accent',
    );
    expect(
      renderContractDocumentation(appearanceProviderContract, 'component-library-under-test'),
    ).toContain('## Do not use for');
  });

  it('covers every layout primitive with one canonical contract', () => {
    const exportNames = [
      'AppearanceProvider',
      'Divider',
      'InlineGroup',
      'ResponsiveGrid',
      'ScrollRegion',
      'Section',
      'Stack',
      'Surface',
    ];

    expect(validateComponentContracts(componentContracts, exportNames)).toHaveLength(
      exportNames.length,
    );
    expect(componentContracts.map((contract) => contract.exportName).sort()).toEqual(exportNames);
  });

  it('places every layout example inside its required appearance provider', () => {
    const layoutContracts = componentContracts.filter(
      (contract) => contract.exportName !== 'AppearanceProvider',
    );

    for (const contract of layoutContracts) {
      expect(contract.relatedExports).toContain('AppearanceProvider');
      expect(contract.composition.join(' ')).toMatch(/AppearanceProvider/);
      for (const example of [...contract.examples, ...contract.counterExamples]) {
        expect(example.code).toContain('<AppearanceProvider');
      }
      expect(renderContractDocumentation(contract, '@fixture/component-library')).toContain(
        'AppearanceProvider',
      );
    }
  });

  it('describes each layout primitive only in terms of the visual roles it paints', () => {
    const expectedAppearance = new Map([
      ['Divider', /border role/],
      ['InlineGroup', /paints no decorative color/],
      ['ResponsiveGrid', /paints no decorative color/],
      ['ScrollRegion', /subtle surface.*border.*focus/i],
      ['Section', /text.*spacing/i],
      ['Stack', /paints no decorative color/],
      ['Surface', /shape.*surface.*text.*border/i],
    ]);

    for (const contract of componentContracts) {
      const expected = expectedAppearance.get(contract.exportName);
      if (expected) {
        expect(contract.appearance.join(' ')).toMatch(expected);
      }
    }
  });

  it('uses owned layout rhythm in the canonical Surface example', () => {
    const surface = componentContracts.find((contract) => contract.exportName === 'Surface');

    expect(surface?.examples[0]?.code).toContain('<Stack');
    expect(renderContractDocumentation(surface!, '@fixture/component-library')).toContain(
      "import {AppearanceProvider, Stack, Surface} from '@fixture/component-library';",
    );
  });

  it('distinguishes Surface containment from nested Section semantics', () => {
    const surface = componentContracts.find((contract) => contract.exportName === 'Surface');

    expect(surface?.inappropriateUses.join(' ')).not.toMatch(
      /content needs a named semantic region/,
    );
    expect(surface?.preferredAlternatives.join(' ')).toMatch(/Section inside Surface/);
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
      validateComponentContracts([appearanceProviderContract, duplicate], ['AppearanceProvider']),
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
