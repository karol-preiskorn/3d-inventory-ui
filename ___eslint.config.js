module.exports = [
  {
    files: ["src/**/*.ts"],
    plugins: {
      '@typescript-eslint': 'error',
    },
    rules: {
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.html"],
    parser: '@angular-eslint/template-parser',
  },
];
