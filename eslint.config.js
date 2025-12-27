import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import prettier from 'eslint-plugin-prettier';
import pluginImport from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import astro from 'eslint-plugin-astro';

const packages = [];
// including css in images as well, because it's rare enough
const imgExtensions = ['png', 'jpg', 'jpeg', 'svg', 'css'];
const fullPhrases = ['@testHelpers', '\\.\\.'];

const imgExtensionRegex = `\\.(${imgExtensions.join('|')})$`;
const imageRegex = `(.+${imgExtensionRegex})`;
const packageRegex = `(${packages.join('|')})\\/.+`;
const relativeRegex = '(\\.)+\\/';
// https://github.com/lydell/eslint-plugin-simple-import-sort/blob/HEAD/CHANGELOG.md#version-700-2020-12-08
// Type imports have \u0000 at the end.
const fullPhraseRegex = `((${fullPhrases.join('|')})(\u0000)?$)`;

const allRegex = `(${[packageRegex, relativeRegex, packageRegex, imageRegex, fullPhraseRegex]
  .map((r) => `(${r})`)
  .join('|')})`;

const commonRules = {
  indent: 'off',
  quotes: 'off',
  curly: 'error',
  semi: ['warn', 'always'],
  'linebreak-style': ['warn', 'unix'],
  'prettier/prettier': 'warn',

  'object-shorthand': 'error',
  'no-console': 'error',
  'no-fallthrough': 'error',
  'no-case-declarations': 'off',
  'no-empty-pattern': 'off',

  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-misused-promises': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-restricted-types': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'warn',
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  'unused-imports/no-unused-imports': 'warn',

  'sort-imports': 'off',
  'import/first': 'error',
  'import/newline-after-import': 'warn',
  'import/order': 'off',
  'import/no-duplicates': 'warn',
  'simple-import-sort/imports': [
    'warn',
    {
      groups: [
        [`^(?!${allRegex})`],
        [`^${packageRegex}(?<!(${imgExtensionRegex}))`],
        [`^((${relativeRegex})|(${fullPhraseRegex}))(?<!(${imgExtensionRegex}))`],
        [`^${imageRegex}`],
      ],
    },
  ],
  'no-restricted-properties': [
    'warn',
    {
      object: 'ReactDOM',
      property: 'findDOMNode',
      message: "Don't use ReactDOM.findDOMNode() as it is deprecated",
    },
    {
      object: 'navigator',
      property: 'userAgent',
      message: "Don't use userAgent directly",
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'package.json',
      'tsconfig.json',
      '**/node_modules/**/*',
      '**/vendor/**/*',
      '**/coverage/**/*',
      '**/dist/**/*',
      '**/.vscode/**/*',
      '**/.storybook/**/*',
      '**/storybook-static/**/*',
      '**/*.d.ts',
      '**/*.d.tsx',
      '**/old/**/*',
      '**/example/**/*',
      '**/*config.js*',
      '**/*config.mjs*',
      '**/*rc.js',
    ],
  },
  {
    files: ['**/*.astro'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      astro.configs.recommended,
      astro.configs['jsx-a11y-recommended'],
    ],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      astro,
      prettier,
      import: pluginImport,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-undef': 'off', // Disable "not defined" errors for specific Astro types that are globally available (ImageMetadata)

      ...commonRules,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-x': reactX,
      'react-dom': reactDom,
      react,
      prettier,
      import: pluginImport,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      ...reactX.configs['recommended-typescript'].rules,
      ...reactDom.configs.recommended.rules,

      ...commonRules,

      'react/prop-types': 'off',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/display-name': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
