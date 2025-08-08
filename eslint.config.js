// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config([
  {
    ignores: ['dist', 'node_modules'], // 무시할 경로
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json', // 타입 기반 규칙 적용
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': prettier,
      'simple-import-sort': simpleImportSort,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    rules: {
      // Prettier
      'prettier/prettier': 'warn',

      // import 정렬
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // React JSX 관련
      'react-hooks/rules-of-hooks': [
        'error',
        {
          additionalHooks:
            '(useQuery|useMutation|useInfiniteQuery|useSuspenseQuery)',
        },
      ],
      'react/react-in-jsx-scope': 'off',

      // TS 규칙
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
