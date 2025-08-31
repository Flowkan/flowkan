import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
      ecmaVersion: "latest",
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];