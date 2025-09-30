import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    files: ["**/*.ts"],
    ignores: ["dist/"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
      ecmaVersion: "latest",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off"
      // "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
]);