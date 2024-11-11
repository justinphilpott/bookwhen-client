export default [
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply these settings to TypeScript files
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      ...require("@typescript-eslint/eslint-plugin").configs.recommended.rules,
    }
  }
];