const tsParser = require('@typescript-eslint/parser')
const ngParser = require('@angular-eslint/template-parser')
const js = require('@eslint/js')
const globals = require('globals')
const ts = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        myCustomGlobal: "readonly"
      }
    },
    files: ["src/**/*.ts"],
    plugins: {
      '@typescript-eslint': ts,
    },
    globals: {
      ...globals.browser
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      semi: ["error", "never"],
      "prefer-const": "error",
    },
    ignores: [
      "/node_modules",
      "/dist",
      "/dist/",
      "/coverage",
      "/.git",
      "/.github",
      "/.husky",
      "/.vscode",
      "/target",
      "/.nyc_output",
      "/.odo",
      "/.vscode",
      "/src/app/components/cube/cube.component.ts"
    ]
  },
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: ngParser,
    }
  },
]
