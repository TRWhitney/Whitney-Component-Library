import type {ComponentContract} from './component-contract.js';

export const appearanceProviderContract = {
  accentBehavior: [
    'The application accent feeds focus, selection, progress, active structure, and relationship rails.',
    'The provider preserves the exact application accent for primary fill and other identity-bearing uses.',
    'Rich hover tint preserves the chosen hue while ordinary content text remains neutral.',
    'Focus, rail, edge, underline, and conditional-boundary roles use the exact accent when it is visible and otherwise derive a saturated same-hue signal.',
  ],
  accessibility: [
    'Choose an accent freely; primary fill retains it exactly while readable foreground content is selected independently.',
    'When the exact primary fill is too close to its actual surrounding surface, the library adds saturated same-hue structural support instead of recoloring the accent.',
    'Contrast applies to the specific surface a structural role actually meets; filled rest and hover states choose readable foreground content independently.',
    'Black and white accents use neutral structural support because they have no hue to preserve.',
    'Do not use the application accent in place of success, warning, or danger meaning.',
  ],
  appearance: [
    'Light and dark are the only supported appearances.',
    'Appearance selects the library-owned neutral canvas, surface, text, and border roles within the provider region.',
  ],
  appropriateUses: [
    'an application or a deliberately isolated application region needs the library appearance and accent',
  ],
  composition: [
    'Place one provider around the library-owned interface region.',
    'Nest a provider only when a contained region intentionally uses a different appearance or accent.',
  ],
  contentRules: [
    'Pass rendered application content as children.',
    'Use exactly one six-digit hexadecimal accent and one explicit appearance.',
  ],
  controlBehavior: [
    'Appearance and accent are required controlled props; the provider has no defaults or internal uncontrolled state.',
  ],
  counterExamples: [
    {
      title: 'Do not change application identity to communicate status',
      description: 'Keep semantic status independent from the application accent.',
      code: [
        'export function StatusColoredIdentity() {',
        '  return (',
        '    <AppearanceProvider appearance="light" accent="#16794a">',
        '      <p>Stable</p>',
        '    </AppearanceProvider>',
        '  );',
        '}',
      ].join('\n'),
    },
  ],
  directionality: [
    'The provider inherits writing direction from its surroundings and does not set a direction attribute.',
  ],
  events: [
    'The provider emits no library callback events; rerender it with new props to change appearance or accent.',
  ],
  examples: [
    {
      title: 'Set the application appearance',
      description: 'Scope one appearance and accent around the application.',
      code: [
        'export function DarkApplication() {',
        '  return (',
        '    <AppearanceProvider appearance="dark" accent="#2474ff">',
        '      <main>Profile</main>',
        '    </AppearanceProvider>',
        '  );',
        '}',
      ].join('\n'),
    },
  ],
  exportName: 'AppearanceProvider',
  forcedColorBehavior: [
    'Forced-color mode replaces decorative color roles with system colors through the static stylesheet.',
  ],
  formBehavior: [
    'The provider does not participate in form submission, reset, constraint validation, or field state.',
  ],
  importPath: '.',
  inappropriateUses: [
    'a component needs a semantic success, warning, or danger state',
    'an application wants to replace spacing, typography, shape, or other owned design tokens',
  ],
  keyboardBehavior: [
    'The provider introduces no keyboard interaction, focus target, or focus-management behavior.',
  ],
  kind: 'provider',
  labeling: [
    'The provider creates no semantic region that needs a label; label the rendered child interface according to its own structure.',
  ],
  localization: [
    'The provider renders no localized content and does not alter the locale inherited by its children.',
  ],
  name: 'AppearanceProvider',
  parts: ['The provider exposes one children region and no named parts or slots.'],
  preferredAlternatives: [
    'Use the component semantic tone API for status meaning.',
    'Use supported component variants instead of replacing internal design tokens.',
  ],
  preferredCompositions: [
    'Place the provider around the application shell, or around a deliberately isolated interface region when a nested identity is required.',
  ],
  purpose:
    'AppearanceProvider scopes the library visual system to light or dark appearance and one application accent.',
  reducedMotionBehavior: [
    'Reduced motion changes transition duration without changing state meaning or removing feedback.',
  ],
  relatedExports: [],
  responsiveBehavior: [
    'The provider does not introduce viewport-specific behavior or mutate the document root.',
  ],
  states: [
    'Changing appearance or accent updates the scoped custom properties without remounting children.',
    'Server and first client render derive identical attributes and color roles from identical props.',
  ],
  stylesheet: './styles.css',
  summary: 'Scope appearance and one application accent.',
  validation: [
    'The TypeScript API restricts appearance to light or dark; accent is runtime-validated as an exact six-digit hexadecimal color.',
    'An invalid accent throws during rendering before incomplete theme variables are applied.',
  ],
} satisfies ComponentContract;
