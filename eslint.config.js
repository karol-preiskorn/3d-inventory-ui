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
  // Configuration for regular TypeScript files (non-spec)
  {
    files: ["src/**/*.ts"],
    ignores: ["src/**/*.spec.ts", "src/**/*.test.ts"], // Exclude spec files from this config
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "@angular-eslint": angularEslintPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: ["./tsconfig.json"], // Use main tsconfig for regular files
        tsconfigRootDir: __dirname,
      },
      globals: {
        console: false,
        window: false,
        document: false,
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

      // TypeScript rules
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
  // Configuration for spec/test files
  {
    files: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: ["./tsconfig.spec.json"], // Use spec tsconfig for test files
        tsconfigRootDir: __dirname,
      },
      globals: {
        jasmine: false,
        jest: true,
        console: false,
        window: false,
        document: false,
      },
    },
    rules: {
      // Relaxed rules for test files
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Allow any in tests but warn
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "max-lines-per-function": ["warn", { "max": 200, "skipBlankLines": true, "skipComments": true }], // Longer functions allowed in tests
      "complexity": ["warn", { "max": 20 }], // Higher complexity allowed in tests
    },
  },
]
