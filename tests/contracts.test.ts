import {readFile} from 'node:fs/promises';

import {describe, expect, it} from 'vitest';

import {
  appearanceProviderContract,
  componentContracts,
  renderAgentIndex,
  renderContractDocumentation,
  renderTypeScriptExamples,
  rangeSliderContract,
  sliderContract,
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

  it('covers every public component with one canonical contract', () => {
    const exportNames = [
      'AlertBanner',
      'AppearanceProvider',
      'Badge',
      'Button',
      'ButtonGroup',
      'Checkbox',
      'CheckboxGroup',
      'ComboBox',
      'DateField',
      'DatePicker',
      'DateRangePicker',
      'Divider',
      'DropZone',
      'EmptyState',
      'Field',
      'FieldGroup',
      'FileTrigger',
      'FormSection',
      'IconButton',
      'InlineAlert',
      'InlineGroup',
      'Link',
      'Meter',
      'NotificationProvider',
      'NumberField',
      'ProgressBar',
      'RadioGroup',
      'RangeSlider',
      'ResponsiveGrid',
      'ScrollRegion',
      'SearchField',
      'Section',
      'SegmentedControl',
      'Select',
      'Skeleton',
      'Slider',
      'Spinner',
      'Stack',
      'StatusIndicator',
      'Surface',
      'Switch',
      'TextArea',
      'TextField',
      'TimeField',
      'ToggleButton',
      'Toolbar',
    ];

    expect(validateComponentContracts(componentContracts, exportNames)).toHaveLength(
      exportNames.length,
    );
    expect(componentContracts.map((contract) => contract.exportName).sort()).toEqual(exportNames);
  });

  it('keeps status, metadata, alerts, progress, meters, and generic busy state distinct', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('StatusIndicator')?.accentBehavior.join(' ')).toMatch(
      /accent.*not.*status|never.*accent/i,
    );
    expect(contractFor('Badge')?.appropriateUses.join(' ')).toMatch(
      /metadata|category|identifier/i,
    );
    expect(contractFor('Badge')?.inappropriateUses.join(' ')).toMatch(/changing status|live/i);
    expect(contractFor('InlineAlert')?.controlBehavior.join(' ')).toMatch(
      /off.*polite.*assertive/i,
    );
    expect(contractFor('AlertBanner')?.appropriateUses.join(' ')).toMatch(/broad.*scope|page/i);
    expect(contractFor('ProgressBar')?.controlBehavior.join(' ')).toMatch(
      /determinate.*indeterminate.*completion/i,
    );
    expect(contractFor('Meter')?.appropriateUses.join(' ')).toMatch(/quantity.*known range/i);
    expect(contractFor('Meter')?.contentRules.join(' ')).toMatch(/threshold.*unit/i);
    expect(contractFor('Spinner')?.preferredAlternatives.join(' ')).toMatch(/ProgressBar/i);
  });

  it('distinguishes loading placeholders, empty content, notifications, and durable feedback', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('Skeleton')?.accessibility.join(' ')).toMatch(/hidden.*assistive/i);
    expect(contractFor('Skeleton')?.preferredAlternatives.join(' ')).toMatch(
      /Spinner|ProgressBar/i,
    );
    expect(contractFor('EmptyState')?.states.join(' ')).toMatch(
      /no data.*no results.*unavailable/i,
    );
    expect(contractFor('EmptyState')?.controlBehavior.join(' ')).toMatch(/one.*action/i);
    expect(contractFor('InlineAlert')?.preferredAlternatives.join(' ')).toMatch(
      /NotificationProvider/i,
    );
    expect(contractFor('InlineAlert')?.relatedExports).toContain('NotificationProvider');
    expect(contractFor('NotificationProvider')?.controlBehavior.join(' ')).toMatch(
      /queue.*three.*timeout.*pause/i,
    );
    expect(contractFor('NotificationProvider')?.inappropriateUses.join(' ')).toMatch(
      /only path.*recover|persistent.*condition/i,
    );
    expect(contractFor('NotificationProvider')?.preferredAlternatives.join(' ')).toMatch(
      /InlineAlert.*AlertBanner.*dialog/i,
    );
  });

  it('keeps file acquisition separate from upload and reports rejected files', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('FileTrigger')?.controlBehavior.join(' ')).toMatch(
      /accepted.*rejected.*source/i,
    );
    expect(contractFor('FileTrigger')?.inappropriateUses.join(' ')).toMatch(
      /upload|storage|persist/i,
    );
    expect(contractFor('DropZone')?.keyboardBehavior.join(' ')).toMatch(/paste.*picker/i);
    expect(contractFor('DropZone')?.states.join(' ')).toMatch(/drag.*rejected.*invalid.*pending/i);
    expect(contractFor('DropZone')?.formBehavior.join(' ')).toMatch(
      /does not submit.*reset.*feedback/i,
    );
    const triggerAdaptationGuidance = [
      ...(contractFor('FileTrigger')?.accentBehavior ?? []),
      ...(contractFor('FileTrigger')?.directionality ?? []),
      ...(contractFor('FileTrigger')?.forcedColorBehavior ?? []),
      ...(contractFor('FileTrigger')?.reducedMotionBehavior ?? []),
      ...(contractFor('FileTrigger')?.responsiveBehavior ?? []),
    ].join(' ');
    expect(triggerAdaptationGuidance).not.toMatch(/drop target|drop boundary|custom content/i);
  });

  it('directs agents among binary, multiple, exclusive, and segmented choice models', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('Checkbox')?.preferredAlternatives.join(' ')).toMatch(
      /Switch.*CheckboxGroup.*RadioGroup.*SegmentedControl/i,
    );
    expect(contractFor('CheckboxGroup')?.appropriateUses.join(' ')).toMatch(/zero.*one.*several/i);
    expect(contractFor('RadioGroup')?.keyboardBehavior.join(' ')).toMatch(
      /arrow.*focus.*selection/i,
    );
    expect(contractFor('RadioGroup')?.controlBehavior.join(' ')).toMatch(/controlled.*null/i);
    expect(contractFor('Switch')?.appropriateUses.join(' ')).toMatch(/on or off.*immediately/i);
    expect(contractFor('SegmentedControl')?.appearance.join(' ')).toMatch(
      /equal.*rail.*labels.*neutral.*no fill/i,
    );
    expect(contractFor('SegmentedControl')?.controlBehavior.join(' ')).toMatch(
      /controlled or uncontrolled exclusive string selection/i,
    );
    expect(contractFor('SegmentedControl')?.controlBehavior.join(' ')).toMatch(/controlled.*null/i);
  });

  it('distinguishes direct civil entry, calendar selection, ranges, and wall-clock time', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('DateField')?.appropriateUses.join(' ')).toMatch(/knows.*direct/i);
    expect(contractFor('DateField')?.preferredAlternatives.join(' ')).toMatch(/DatePicker/i);
    expect(contractFor('DatePicker')?.appropriateUses.join(' ')).toMatch(/nearby.*availability/i);
    expect(contractFor('DatePicker')?.counterExamples[0]?.description).toMatch(/faster to type/i);
    expect(contractFor('DateRangePicker')?.controlBehavior.join(' ')).toMatch(
      /continuous interval/i,
    );
    expect(contractFor('TimeField')?.inappropriateUses.join(' ')).toMatch(/time-zone.*instant/i);
  });

  it('distinguishes finite selection from editable autocomplete', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('Select')?.appropriateUses.join(' ')).toMatch(/finite list/i);
    expect(contractFor('Select')?.preferredAlternatives.join(' ')).toMatch(
      /ComboBox.*editable|ComboBox.*filter/i,
    );
    expect(contractFor('Select')?.states.join(' ')).toMatch(/no read-only prop/i);
    expect(contractFor('ComboBox')?.appropriateUses.join(' ')).toMatch(
      /typing.*filtering.*dynamic.*asynchronous/i,
    );
    expect(contractFor('ComboBox')?.controlBehavior.join(' ')).toMatch(
      /Selection and input text.*each.*controlled or uncontrolled/i,
    );
    expect(contractFor('ComboBox')?.composition.join(' ')).toMatch(
      /manual.*dynamic.*asynchronous/i,
    );
  });

  it('distinguishes approximate adjustment from interval and exact entry', () => {
    expect(sliderContract.appropriateUses.join(' ')).toMatch(/one approximate.*finite range/i);
    expect(sliderContract.preferredAlternatives.join(' ')).toMatch(/NumberField.*exact/i);
    expect(sliderContract.controlBehavior.join(' ')).toMatch(
      /finite.*minValue.*maxValue.*step.*controlled or uncontrolled/i,
    );
    expect(rangeSliderContract.controlBehavior.join(' ')).toMatch(
      /two-value tuple.*ascending.*never cross/i,
    );
    expect(rangeSliderContract.labeling.join(' ')).toMatch(/thumbLabels.*distinct/i);
    expect(rangeSliderContract.formBehavior.join(' ')).toMatch(/names.*two.*native range/i);
  });

  it('directs agents among custom, text, multiline, numeric, search, group, and section semantics', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('Field')?.preferredAlternatives.join(' ')).toMatch(
      /TextField.*TextArea.*NumberField.*SearchField/i,
    );
    expect(contractFor('TextField')?.inappropriateUses.join(' ')).toMatch(
      /multiline.*numeric.*search/i,
    );
    expect(contractFor('TextArea')?.appropriateUses.join(' ')).toMatch(/multiline|prose/i);
    expect(contractFor('NumberField')?.controlBehavior.join(' ')).toMatch(
      /localized.*incomplete.*committed/i,
    );
    expect(contractFor('NumberField')?.formBehavior.join(' ')).toMatch(
      /raw number.*external reset/i,
    );
    expect(contractFor('SearchField')?.keyboardBehavior.join(' ')).toMatch(/Enter.*Escape/i);
    expect(contractFor('FieldGroup')?.accessibility.join(' ')).toMatch(/fieldset.*legend/i);
    expect(contractFor('FieldGroup')?.appearance.join(' ')).toMatch(/fieldset|group surface/i);
    expect(contractFor('FieldGroup')?.appearance.join(' ')).not.toMatch(
      /control height|support track|hover|focus|pending/i,
    );
    expect(contractFor('FormSection')?.preferredAlternatives.join(' ')).toMatch(
      /FieldGroup.*Section.*Surface/i,
    );
    expect(contractFor('FormSection')?.appearance.join(' ')).toMatch(/rhythm|heading|region/i);
    expect(contractFor('FormSection')?.appearance.join(' ')).not.toMatch(
      /control height|support track|hover|focus|pending/i,
    );
  });

  it('directs agents among command, navigation, selection, and composite action semantics', () => {
    const contractFor = (exportName: string) =>
      componentContracts.find((contract) => contract.exportName === exportName);

    expect(contractFor('Button')?.appropriateUses.join(' ')).toMatch(/command|submit/i);
    expect(contractFor('Button')?.preferredAlternatives.join(' ')).toMatch(/Link.*navigation/i);
    expect(contractFor('Link')?.appropriateUses.join(' ')).toMatch(/navigat/i);
    expect(contractFor('ToggleButton')?.appropriateUses.join(' ')).toMatch(/persistent|binary/i);
    expect(contractFor('IconButton')?.labeling.join(' ')).toMatch(/tooltip/i);
    expect(contractFor('ButtonGroup')?.keyboardBehavior.join(' ')).toMatch(/tab/i);
    expect(contractFor('Toolbar')?.keyboardBehavior.join(' ')).toMatch(/arrow/i);
    expect(contractFor('ButtonGroup')?.composition.join(' ')).toMatch(/consumer component/i);
    expect(contractFor('Toolbar')?.composition.join(' ')).toMatch(/consumer component/i);
    expect(contractFor('Button')?.examples[0]?.code).toContain(
      '<Button variant="primary" isPending',
    );
    expect(contractFor('Button')?.examples[0]?.code).not.toContain('isPending={false}');
    expect(contractFor('Link')?.responsiveBehavior.join(' ')).not.toMatch(/control height/i);
    expect(contractFor('ButtonGroup')?.appearance.join(' ')).toMatch(/group.*geometry|layout/i);
    expect(contractFor('ButtonGroup')?.appearance.join(' ')).not.toMatch(/danger|pending/i);
    expect(contractFor('Toolbar')?.accentBehavior.join(' ')).toMatch(/children|descendant/i);
    expect(contractFor('Button')?.contentRules.join(' ')).toMatch(
      /secondary.*standard.*quiet.*supporting/i,
    );
    expect(contractFor('IconButton')?.contentRules.join(' ')).toMatch(
      /secondary.*boundary.*quiet.*containment.*danger.*destructive/i,
    );
    expect(contractFor('ToggleButton')?.contentRules.join(' ')).toMatch(
      /secondary.*standalone.*quiet.*toolbar/i,
    );
  });

  it('distinguishes literal accent identity from derived support roles', () => {
    const button = componentContracts.find((contract) => contract.exportName === 'Button');
    const providerGuidance = [
      ...appearanceProviderContract.accentBehavior,
      ...appearanceProviderContract.accessibility,
    ].join(' ');

    expect(providerGuidance).toMatch(/exact|literal/i);
    expect(providerGuidance).toMatch(/primary fill/i);
    expect(providerGuidance).toMatch(/neutral.*(?:text|content)/i);
    expect(providerGuidance).toMatch(/saturated.*same-hue/i);
    expect(providerGuidance).toMatch(/actual|specific|role.local/i);
    expect(button?.accentBehavior.join(' ')).toMatch(/exact.*accent/i);
    expect(button?.accentBehavior.join(' ')).toMatch(/border/i);
    for (const exportName of ['IconButton', 'Link', 'ToggleButton']) {
      const contract = componentContracts.find((candidate) => candidate.exportName === exportName);
      expect(contract?.accentBehavior.join(' ')).toMatch(/saturated|same-hue|role-specific/i);
    }
  });

  it('keeps selected-label color neutral in every accepted visual source', async () => {
    const visualDirection = await readFile(
      '.work/library-foundation/decisions/05-visual-direction.md',
      'utf8',
    );

    expect(visualDirection).not.toMatch(/bottom rail and accent label/i);
    expect(visualDirection).toMatch(/bottom rail.*label.*neutral|neutral.*label.*bottom rail/i);
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
      ['Divider', /border color/],
      ['InlineGroup', /spacing scale.*adds no color/],
      ['ResponsiveGrid', /preset spacing.*adds no color/],
      ['ScrollRegion', /subtle background.*border.*focus/i],
      ['Section', /text.*spacing/i],
      ['Stack', /spacing scale.*adds no color/],
      ['Surface', /shape.*background.*text.*border/i],
    ]);

    for (const contract of componentContracts) {
      const expected = expectedAppearance.get(contract.exportName);
      if (expected) {
        expect(contract.appearance.join(' ')).toMatch(expected);
      }
    }
  });

  it('documents ScrollRegion scrollbar activity without replacing native scrolling', () => {
    const scrollRegion = componentContracts.find(
      (contract) => contract.exportName === 'ScrollRegion',
    );

    expect(scrollRegion?.states.join(' ')).toMatch(/activity.*idle/i);
    expect(scrollRegion?.events.join(' ')).toMatch(/no callback.*temporary/i);
    expect(scrollRegion?.controlBehavior.join(' ')).toMatch(/native.*whether.*scrollbar/i);
    expect(scrollRegion?.reducedMotionBehavior.join(' ')).toMatch(/fade.*idle visibility/i);
  });

  it('uses Stack for spacing in the canonical Surface example', () => {
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
