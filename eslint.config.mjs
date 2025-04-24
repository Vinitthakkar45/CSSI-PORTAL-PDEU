import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      semi: ['warn', 'always'],
      '@typescript-eslint/no-unused-vars': 'off', // Temporarily disable unused vars warning
      'jsx-a11y/alt-text': 'warn', // Change to warning instead of error
      'react-hooks/exhaustive-deps': 'warn', // Change to warning
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off'
    },
  },
  prettierConfig,
];

export default eslintConfig;

