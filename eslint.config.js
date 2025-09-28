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
    ignores: [
      "node_modules/**/*",
      "node_modules/**/.*.json",
      "documentation/**/*",
      ".git/**/*",
      "dist/**/*",
      "src/index.html",
      "src/**/*.html", // Ignore HTML files to avoid parsing errors
      "src/assets/**/*" // Ignore asset files
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        jasmine: false,
        "jest/globals": true,
        mongo: true,
        console: false,
        window: false,
        document: false,
      },
    },
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "@angular-eslint": angularEslintPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      // Angular specific rules
      "@angular-eslint/component-selector": [
        "error",
        { prefix: "app", style: "kebab-case", type: "element" },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { prefix: "app", style: "camelCase", type: "attribute" },
      ],
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/no-output-on-prefix": "error",
      "@angular-eslint/use-injectable-provided-in": "error",
      "@angular-eslint/no-conflicting-lifecycle": "error",
      "@angular-eslint/prefer-on-push-component-change-detection": "warn",

      // TypeScript rules (without type information requirements)
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

      // General code quality rules
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "complexity": ["warn", { "max": 15 }],
      "max-depth": ["warn", { "max": 4 }],
      "max-lines-per-function": ["warn", { "max": 75, "skipBlankLines": true, "skipComments": true }],

      // Import/Export rules
      "no-duplicate-imports": "error",
      "sort-imports": ["warn", {
        "ignoreCase": true,
        "ignoreDeclarationSort": true,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
      }],
    },
  },
]
