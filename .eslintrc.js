module.exports = {
  root: true,
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalDecorators: true,
    },
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "google", "plugin:prettier/recommended"],
  rules: {
    curly: ["error", "all"],
    "new-cap": "off",
    "require-jsdoc": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    camelcase: "off",
    "no-invalid-this": "off",
    "max-len": [
      "error",
      {
        code: 80,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
      },
    ],
    semi: ["error", "never"],
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "linebreak-style": 0,
    "no-confusing-arrow": [
      "error",
      {
        allowParens: false,
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "space-infix-ops": "error",
    "eol-last": ["error", "always"],
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: [
          "./packages/medusa/tsconfig.json",

          "./packages/admin/dashboard/tsconfig.json",
          "./packages/admin/admin-sdk/tsconfig.json",
          "./packages/admin/admin-shared/tsconfig.json",
          "./packages/admin/admin-bundler/tsconfig.json",
          "./packages/admin/admin-vite-plugin/tsconfig.json",

          "./packages/design-system/ui/tsconfig.json",
          "./packages/design-system/icons/tsconfig.json",
          "./packages/design-system/ui-preset/tsconfig.json",
          "./packages/design-system/toolbox/tsconfig.json",

          "./packages/cli/create-medusa-app/tsconfig.json",
          "./packages/cli/medusa-cli/tsconfig.json",
          "./packages/cli/oas/medusa-oas-cli/tsconfig.json",

          "./packages/core/orchestration/tsconfig.json",
          "./packages/core/workflows-sdk/tsconfig.json",
          "./packages/core/modules-sdk/tsconfig.json",
          "./packages/core/js-sdk/tsconfig.json",
          "./packages/core/types/tsconfig.json",
          "./packages/core/utils/tsconfig.json",
          "./packages/core/medusa-test-utils/tsconfig.json",

          "./packages/modules/product/tsconfig.json",
          "./packages/modules/event-bus-local/tsconfig.json",
          "./packages/modules/event-bus-redis/tsconfig.json",
          "./packages/modules/cache-redis/tsconfig.json",
          "./packages/modules/cache-inmemory/tsconfig.json",
          "./packages/modules/caching/tsconfig.json",
          "./packages/modules/workflow-engine-redis/tsconfig.json",
          "./packages/modules/workflow-engine-inmemory/tsconfig.json",
          "./packages/modules/fulfillment/tsconfig.json",
          "./packages/modules/api-key/tsconfig.json",
          "./packages/modules/auth/tsconfig.json",
          "./packages/modules/cart/tsconfig.json",
          "./packages/modules/currency/tsconfig.json",
          "./packages/modules/index/tsconfig.json",
          "./packages/modules/customer/tsconfig.json",
          "./packages/modules/file/tsconfig.json",
          "./packages/modules/inventory-next/tsconfig.json",
          "./packages/modules/stock-location-next/tsconfig.json",
          "./packages/modules/order/tsconfig.json",
          "./packages/modules/payment/tsconfig.json",
          "./packages/modules/pricing/tsconfig.json",
          "./packages/modules/promotion/tsconfig.json",
          "./packages/modules/region/tsconfig.json",
          "./packages/modules/sales-channel/tsconfig.json",
          "./packages/modules/store/tsconfig.json",
          "./packages/modules/tax/tsconfig.json",
          "./packages/modules/workflow-engine-inmemory/tsconfig.json",
          "./packages/modules/workflow-engine-redis/tsconfig.json",
          "./packages/modules/link-modules/tsconfig.json",
          "./packages/modules/user/tsconfig.json",
          "./packages/modules/locking/tsconfig.json",
          "./packages/modules/translation/tsconfig.json",

          "./packages/modules/providers/file-local/tsconfig.json",
          "./packages/modules/providers/file-s3/tsconfig.json",
          "./packages/modules/providers/fulfillment-manual/tsconfig.json",
          "./packages/modules/providers/payment-stripe/tsconfig.json",
          "./packages/modules/providers/locking-postgres/tsconfig.json",
          "./packages/modules/providers/locking-redis/tsconfig.json",
          "./packages/modules/providers/caching-redis/tsconfig.json",

          "./packages/framework/tsconfig.json",
        ],
      },
      rules: {
        "valid-jsdoc": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/keyword-spacing": "error",
        "@typescript-eslint/space-before-function-paren": [
          "error",
          {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
          },
        ],
        "@typescript-eslint/space-infix-ops": "error",

        // --- Rules to be fixed
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: [
        "./packages/design-system/ui/**/*.ts",
        "./packages/design-system/ui/**/*.tsx",
      ],
      extends: [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "react/no-children-prop": "off",
        "react-hooks/exhaustive-deps": "warn",
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./packages/design-system/ui/tsconfig.json",
      },
    },
    {
      files: [
        "./packages/design-system/icons/**/*.ts",
        "./packages/design-system/icons/**/*.tsx",
      ],
      extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "react/no-children-prop": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./packages/design-system/icons/tsconfig.json",
      },
    },
    {
      files: [
        "./packages/admin/dashboard/**/*.ts",
        "./packages/admin/dashboard/**/*.tsx",
      ],
      plugins: ["unused-imports", "react-refresh"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        project: "./packages/admin/dashboard/tsconfig.json",
      },
      globals: {
        __BASE__: "readonly",
      },
      env: {
        browser: true,
      },
      rules: {
        "prettier/prettier": "error",
        "react/prop-types": "off",
        "new-cap": "off",
        "require-jsdoc": "off",
        "valid-jsdoc": "off",
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        "no-unused-expressions": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
      },
    },
  ],
}
