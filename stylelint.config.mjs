/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    'dist/**',
    'node_modules/**',
    // Captured evaluation outputs, not maintained application code.
    '.work/agent-consumption-strategy/research/pilot/**',
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};
