import { Linter } from "eslint"
import angularEslintPlugin from "@angular-eslint/eslint-plugin"
import angularEslintTemplatePlugin from "@angular-eslint/eslint-plugin-template"
import jestPlugin from "eslint-plugin-jest"
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"

export default /** @type {Linter.FlatConfig[]} */ ([
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        jasmine: false,
        jest: true,
        "jest/globals": true,
        mongo: true,
        node: true,
      },
      parserOptions: {
        project: "./tsconfig.json", // Ensure this points to the correct tsconfig file
        tsconfigRootDir: ".",
      },
    },
    ignores: [
      "./node_modules/**/*",
      "./documentation/**/*",
      ".git/**/*",
      "./dist/**/*",
      "src/**/*.spec.ts", // Exclude test files if needed
      "src/index.html", // Exclude index.html
    ],
    plugins: {
      jest: jestPlugin,
    },
    rules: {},
  },
  {
    files: ["src/**/*/*.ts"],
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
        {
          prefix: "app",
          style: "kebab-case",
          type: "element",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          prefix: "app",
          style: "camelCase",
          type: "attribute",
        },
      ],
      "@angular-eslint/no-input-rename": "off",
    },
  },
  {
    files: ["./src/*.html"],
    plugins: {
      "@angular-eslint/template": angularEslintTemplatePlugin,
    },
    rules: {
      // Add template-specific rules here
    },
    ignores: [
      "./node_modules/**/*",
      "./documentation/**/*",
      ".git/**/*",
      "./dist/**/*",
      "src/**/*.spec.ts", // Exclude test files if needed
      "src/index.html", // Exclude index.html
    ],
  },
])
