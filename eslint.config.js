import angularEslintPlugin from "@angular-eslint/eslint-plugin"
import angularEslintTemplatePlugin from "@angular-eslint/eslint-plugin-template"
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        jasmine: false,
        "jest/globals": true,
        mongo: true,
      },
      parserOptions: {
      },
      ignores: [
        "node_modules/**/*",
        "node_modules/**/.*.json",
        "documentation/**/*",
        ".git/**/*",
        "dist/**/*",
        "src/index.html",
      ],
    },
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "@angular-eslint": angularEslintPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        { prefix: "app", style: "kebab-case", type: "element" },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { prefix: "app", style: "camelCase", type: "attribute" },
      ],
      "@angular-eslint/no-input-rename": "off",
    },
  },
  {
    files: ["src/**/*.html"],
    plugins: {
      "@angular-eslint/template": angularEslintTemplatePlugin,
    },
    rules: {}
  }
]
