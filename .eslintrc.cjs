module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "prettier"],
  rules: {
    "@typescript-eslint/triple-slash-reference": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
