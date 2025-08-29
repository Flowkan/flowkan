import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Configuración para archivos JavaScript
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
    },
  },
  // Configuración para archivos TypeScript
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
    },
  },
]);