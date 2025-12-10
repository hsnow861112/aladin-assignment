import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores(
    [
      // Default ignores of eslint-config-next:
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ]
  ),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      prettier,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          useTabs: true,
          tabWidth: 4,
          trailingComma: 'none',
          printWidth: 150,
          bracketSpacing: true,
          arrowParens: 'avoid',
          endOfLine: 'auto'
        },
      ],
    }
  }  
]);

export default eslintConfig;
