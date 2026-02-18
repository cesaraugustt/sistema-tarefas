import globals from "globals";
import pluginJest from "eslint-plugin-jest";
import pluginPrettier from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  },
  pluginPrettier,
  {
    files: ["tests/**"],
    plugins: { jest: pluginJest },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
