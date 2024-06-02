export default [

  {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@angular-eslint/recommended"
    ],
    "ignores": [
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
    ],
    "overrides": [
      {
        "env": {
          "jasmine": true
        },
        "files": [
          "*.spec.ts"
        ]
      }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint",
      "@angular-eslint"
    ],
    "rules": {
      "@angular-eslint/component-selector": [
        "error",
        {
          "prefix": "app",
          "style": "kebab-case",
          "type": "element"
        }
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          "prefix": "app",
          "style": "camelCase",
          "type": "attribute"
        }
      ]
    }
  }
]
