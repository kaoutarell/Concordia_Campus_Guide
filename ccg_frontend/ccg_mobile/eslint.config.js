import js from "@eslint/js";
import react from "eslint-plugin-react";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  react.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: { react, ts },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-console": "warn",
    },
  },
];
