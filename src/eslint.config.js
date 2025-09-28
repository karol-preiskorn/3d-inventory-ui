// @ts-check
import tseslint from "typescript-eslint"
import rootConfig from "../eslint.config.js"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config([
  ...rootConfig,
  {
    files: ["**/*.ts"],
    ignores: ["**/*.spec.ts", "**/*.test.ts"], // Exclude spec files from this config
    languageOptions: {
      parserOptions: {
        project: ["../tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts"], // Configuration for spec files
    languageOptions: {
      parserOptions: {
        project: ["../tsconfig.spec.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Relaxed rules for test files
      "max-lines-per-function": ["warn", { "max": 200, "skipBlankLines": true, "skipComments": true }],
      "complexity": ["warn", { "max": 20 }],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
])
