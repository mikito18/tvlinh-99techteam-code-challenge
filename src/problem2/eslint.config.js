import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuration for all JS/TS files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },
  
  // TypeScript configuration
  ...tseslint.configs.recommended,
  
  // React configuration
  ...pluginReact.configs.flat.recommended,
  
  // React Hooks configuration
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
  
  // React Refresh configuration for Vite
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  
  // Additional project-specific configuration
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      
      "react/prop-types": "off", // Disabled because we use TypeScript
      "react/jsx-uses-react": "off", // Same as above
      "react/jsx-uses-vars": "error",
      
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);
