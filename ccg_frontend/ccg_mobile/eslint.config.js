const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,
  react.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      react: pluginObject,
      ts: pluginObject,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-console": "warn",
    },
  },
];
