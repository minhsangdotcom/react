module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended",
      "airbnb",
      "airbnb/hooks",
      "prettier"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: [
      "react",
      "react-hooks",
      "@typescript-eslint",
      "jsx-a11y",
      "import",
      "prettier"
    ],
    rules: {
      "prettier/prettier": ["error"],
      "react/react-in-jsx-scope": "off", // No need to import React in Next.js or new React versions
      "react/prop-types": "off", // Not needed when using TypeScript
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "import/order": ["error", { "alphabetize": { "order": "asc" } }],
      "no-console": "warn",
      "no-unused-vars": "off", // Use TypeScript's rule instead
      "react/jsx-filename-extension": ["warn", { "extensions": [".tsx"] }]
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  