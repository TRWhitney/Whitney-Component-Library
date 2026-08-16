import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const javascriptFiles = ['**/*.{js,mjs,cjs}'];
const typescriptFiles = ['**/*.{ts,tsx,mts,cts}'];
const typedTypescriptFiles = ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}', 'vitest.config.ts'];

export default defineConfig(
  globalIgnores(['dist/**', 'node_modules/**', 'coverage/**', '.typecheck-*/**']),
  {
    files: javascriptFiles,
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['.work/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: typescriptFiles,
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: typedTypescriptFiles,
    extends: [tseslint.configs.recommendedTypeChecked, reactHooks.configs.flat.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
