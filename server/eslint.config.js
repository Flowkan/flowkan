import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
    },
    extends: ["js/recommended"],
  },
]);
