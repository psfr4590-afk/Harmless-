import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist/**/*", "coverage/**/*", "*.rules"] },
  js.configs.recommended,
  {
    files: ["**/*.mjs", "tests/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        fetch: "readonly",
        URL: "readonly",
        Response: "readonly",
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
];
