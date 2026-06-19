import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import sonarjs from 'eslint-plugin-sonarjs'

export default [
  // Parser de TypeScript para todos los archivos .ts
  {
    files: ['src/**/*.ts'],
    languageOptions: { parser: tsParser },
    plugins: {
      '@typescript-eslint': tsPlugin,
      sonarjs,
    },
  },
  // Reglas de code smells — excluye main.ts (es UI pura)
  {
    files: ['src/**/*.ts'],
    ignores: ['src/main.ts'],
    rules: {
      // ── Long Method ──────────────────────────────────────────
      'max-lines-per-function': ['warn', { max: 20, skipBlankLines: true, skipComments: true }],

      // ── God Class (archivo demasiado largo) ──────────────────
      'max-lines': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],

      // ── Magic Numbers ────────────────────────────────────────
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreDefaultValues: true }],

      // ── Dead Code ────────────────────────────────────────────
      'no-unreachable': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // ── Duplicate Code ───────────────────────────────────────
      'sonarjs/no-duplicate-string': ['warn', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'warn',

      // ── Poor Naming ──────────────────────────────────────────
      'id-length': ['warn', { min: 2, exceptions: ['i', 'p', 'e', 'x'] }],
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],

      // ── Excessive Comments ───────────────────────────────────
      'no-inline-comments': 'warn',
    },
  },
]
