export type ComponentKind = 'component' | 'composition' | 'provider';

export interface ContractExample {
  readonly code: string;
  readonly description: string;
  readonly title: string;
}

export interface ComponentContract {
  readonly accentBehavior: readonly string[];
  readonly accessibility: readonly string[];
  readonly appearance: readonly string[];
  readonly appropriateUses: readonly string[];
  readonly composition: readonly string[];
  readonly contentRules: readonly string[];
  readonly controlBehavior: readonly string[];
  readonly counterExamples: readonly ContractExample[];
  readonly directionality: readonly string[];
  readonly events: readonly string[];
  readonly examples: readonly ContractExample[];
  readonly exportName: string;
  readonly forcedColorBehavior: readonly string[];
  readonly formBehavior: readonly string[];
  readonly importPath: '.';
  readonly inappropriateUses: readonly string[];
  readonly keyboardBehavior: readonly string[];
  readonly kind: ComponentKind;
  readonly labeling: readonly string[];
  readonly localization: readonly string[];
  readonly name: string;
  readonly parts: readonly string[];
  readonly preferredAlternatives: readonly string[];
  readonly preferredCompositions: readonly string[];
  readonly purpose: string;
  readonly reducedMotionBehavior: readonly string[];
  readonly relatedExports: readonly string[];
  readonly responsiveBehavior: readonly string[];
  readonly states: readonly string[];
  readonly stylesheet?: './styles.css';
  readonly summary: string;
  readonly validation: readonly string[];
}

export interface ComponentManifest {
  readonly schemaVersion: 1;
  readonly exports: readonly ComponentContract[];
}

const REQUIRED_TEXT_FIELDS = ['exportName', 'name', 'purpose', 'summary'] as const;
const REQUIRED_GUIDANCE_FIELDS = [
  'accentBehavior',
  'accessibility',
  'appearance',
  'appropriateUses',
  'composition',
  'contentRules',
  'controlBehavior',
  'counterExamples',
  'directionality',
  'events',
  'examples',
  'forcedColorBehavior',
  'formBehavior',
  'inappropriateUses',
  'keyboardBehavior',
  'labeling',
  'localization',
  'parts',
  'preferredAlternatives',
  'preferredCompositions',
  'reducedMotionBehavior',
  'responsiveBehavior',
  'states',
  'validation',
] as const;

export function validateComponentContracts(
  contracts: readonly ComponentContract[],
  publicExports: readonly string[],
): readonly ComponentContract[] {
  const knownExports = new Set(publicExports);
  const names = new Set<string>();
  const contractedExports = new Set<string>();

  for (const contract of contracts) {
    for (const field of REQUIRED_TEXT_FIELDS) {
      if (contract[field].trim().length === 0) {
        throw new Error(`${contract.name || 'Component contract'} is missing required ${field}.`);
      }
    }

    for (const field of REQUIRED_GUIDANCE_FIELDS) {
      if (
        contract[field].length === 0 ||
        contract[field].some((entry) =>
          typeof entry === 'string'
            ? entry.trim().length === 0
            : entry.title.trim().length === 0 ||
              entry.description.trim().length === 0 ||
              entry.code.trim().length === 0,
        )
      ) {
        throw new Error(`${contract.name} is missing required ${field} guidance.`);
      }
    }

    if (names.has(contract.name)) {
      throw new Error(`Component contract name "${contract.name}" is duplicated.`);
    }
    names.add(contract.name);

    if (!knownExports.has(contract.exportName)) {
      throw new Error(
        `${contract.exportName} is not a public export referenced by the ${contract.name} contract.`,
      );
    }
    if (contractedExports.has(contract.exportName)) {
      throw new Error(`${contract.exportName} has more than one canonical contract.`);
    }
    contractedExports.add(contract.exportName);

    for (const relatedExport of contract.relatedExports) {
      if (!knownExports.has(relatedExport)) {
        throw new Error(
          `${relatedExport} is not a public export referenced by the ${contract.name} contract.`,
        );
      }
    }
  }

  for (const publicExport of knownExports) {
    if (!contractedExports.has(publicExport)) {
      throw new Error(`${publicExport} does not have a canonical contract.`);
    }
  }

  return contracts;
}

export function toComponentManifest(
  contracts: readonly ComponentContract[],
): ComponentManifest {
  return {schemaVersion: 1, exports: contracts};
}

export function renderAgentIndex(contracts: readonly ComponentContract[]): string {
  const entries = contracts.map(
    (contract) =>
      `- ${contract.exportName}: ${contract.summary} Use when ${contract.appropriateUses[0]} Avoid when ${contract.inappropriateUses[0]}`,
  );

  return ['# Component agent index', '', ...entries, ''].join('\n');
}

export function renderContractDocumentation(
  contract: ComponentContract,
  packageName: string,
): string {
  const section = (title: string, items: readonly string[]) => [
    `## ${title}`,
    '',
    ...items.map((item) => `- ${item}`),
    '',
  ];
  const importLines = [
    ...(contract.stylesheet
      ? [`import '${packageName}/${contract.stylesheet.replace('./', '')}';`]
      : []),
    `import {${contract.exportName}} from '${packageName}';`,
  ];
  const renderExample = (example: ContractExample) => [
    `### ${example.title}`,
    '',
    example.description,
    '',
    '```tsx',
    ...importLines,
    '',
    example.code,
    '```',
    '',
  ];
  const examples = contract.examples.flatMap(renderExample);
  const counterExamples = contract.counterExamples.flatMap(renderExample);

  return [
    `# ${contract.name}`,
    '',
    contract.purpose,
    '',
    ...section('Use for', contract.appropriateUses),
    ...section('Do not use for', contract.inappropriateUses),
    ...section('Prefer instead', contract.preferredAlternatives),
    ...section('Composition and parts', [...contract.composition, ...contract.parts]),
    ...section('Preferred higher-level compositions', contract.preferredCompositions),
    ...section('Content', contract.contentRules),
    ...section('States', contract.states),
    ...section('Control, events, validation, and forms', [
      ...contract.controlBehavior,
      ...contract.events,
      ...contract.validation,
      ...contract.formBehavior,
    ]),
    ...section('Accessibility', contract.accessibility),
    ...section('Keyboard, labeling, localization, and direction', [
      ...contract.keyboardBehavior,
      ...contract.labeling,
      ...contract.localization,
      ...contract.directionality,
    ]),
    ...section('Appearance and responsive behavior', [
      ...contract.appearance,
      ...contract.responsiveBehavior,
    ]),
    ...section('Accent, forced colors, and reduced motion', [
      ...contract.accentBehavior,
      ...contract.forcedColorBehavior,
      ...contract.reducedMotionBehavior,
    ]),
    '## Examples',
    '',
    ...examples,
    '## Counterexamples',
    '',
    ...counterExamples,
  ].join('\n');
}

export function renderTypeScriptExamples(
  contracts: readonly ComponentContract[],
  packageName: string,
): string {
  const stylesheets = new Set(
    contracts.flatMap((contract) => (contract.stylesheet ? [contract.stylesheet] : [])),
  );
  const imports = contracts.map(
    (contract) => `import {${contract.exportName}} from '${packageName}';`,
  );
  const examples = contracts.flatMap((contract) => [
    ...contract.examples.map((example) => example.code),
    ...contract.counterExamples.map((example) => example.code),
  ]);

  return [
    "'use client';",
    '',
    ...[...stylesheets].map(
      (stylesheet) => `import '${packageName}/${stylesheet.replace('./', '')}';`,
    ),
    ...imports,
    '',
    ...examples.flatMap((example) => [example, '']),
  ].join('\n');
}
