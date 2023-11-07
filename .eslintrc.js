module.exports = {
  ignorePatterns: [`.eslintrc.js`, `compiled/`, `dist/`, `signWindows.js`],
  overrides: [
    {
      files: `*.{js,ts}`,
      extends: [
        `eslint:recommended`,
        `plugin:@typescript-eslint/recommended`,
        `prettier`,
        `plugin:import/recommended`,
        `plugin:import/typescript`,
      ],
      parser: `@typescript-eslint/parser`,
      parserOptions: {
        project: [`./tsconfig.json`],
      },
      plugins: [`filenames`, `import`],
      settings: {
        'import/external-module-folders': [`node_modules`, `@types`],
        'import/parsers': {
          '@typescript-eslint/parser': [`.ts`],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: `./tsconfig.json`,
          },
        },
      },
      rules: {
        '@typescript-eslint/array-type': [`error`, { default: `generic` }],
        '@typescript-eslint/consistent-indexed-object-style': [
          `error`,
          `record`,
        ],
        '@typescript-eslint/explicit-function-return-type': `error`,
        '@typescript-eslint/explicit-module-boundary-types': `error`,
        '@typescript-eslint/naming-convention': [
          `error`,
          {
            selector: `default`,
            format: [`camelCase`],
          },
          {
            selector: `objectLiteralProperty`,
            format: null,
          },
          {
            selector: `objectLiteralMethod`,
            format: null,
          },
          {
            selector: `variable`,
            modifiers: [`destructured`],
            format: null,
          },
          {
            selector: `variable`,
            modifiers: [`const`, `global`],
            format: [`camelCase`, `PascalCase`, `UPPER_CASE`],
          },
          {
            selector: `parameter`,
            format: [`camelCase`, `PascalCase`],
          },
          {
            selector: `typeLike`,
            format: [`PascalCase`],
          },
          {
            selector: `enumMember`,
            format: [`PascalCase`],
          },
          {
            selector: `typeProperty`,
            format: [`camelCase`, `PascalCase`],
          },
          {
            selector: `variable`,
            format: [`PascalCase`],
            filter: {
              regex: `^(EnhanceApp|WithApollo)$`,
              match: true,
            },
          },
          {
            selector: 'import',
            format: ['camelCase', 'PascalCase'],
          },
        ],
        '@typescript-eslint/no-explicit-any': `error`,
        '@typescript-eslint/no-shadow': `error`,
        '@typescript-eslint/no-unused-vars': `error`,
        '@typescript-eslint/no-use-before-define': `error`,
        '@typescript-eslint/no-useless-constructor': `error`,
        '@typescript-eslint/quotes': [`error`, `backtick`],
        'arrow-body-style': [`error`, `always`],
        'arrow-parens': [`error`, `always`],
        curly: [`error`, `all`],
        'dot-notation': `error`,
        eqeqeq: `error`,
        'filenames/match-regex': [`error`, `^[A-Za-z0-9.]+$`],
        'filenames/match-exported': `error`,
        'func-style': [`error`, `expression`, { allowArrowFunctions: true }],
        'import/extensions': [`error`, `never`],
        'import/first': `error`,
        'import/no-anonymous-default-export': `off`,
        'import/no-cycle': [
          `error`,
          {
            maxDepth: undefined,
          },
        ],
        'import/no-extraneous-dependencies': `error`,
        'import/no-mutable-exports': `error`,
        'import/order': [
          `error`,
          {
            groups: [
              `builtin`,
              `external`,
              `internal`,
              `parent`,
              `sibling`,
              `index`,
              `unknown`,
            ],
            'newlines-between': `always`,
            alphabetize: {
              order: `asc`,
              caseInsensitive: true,
            },
          },
        ],
        'import/prefer-default-export': `off`,
        'max-len': [
          `error`,
          {
            code: 80,
            ignorePattern: `^import .*|eslint-disable-next-line|^.* as .*,$`,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreUrls: true,
          },
        ],
        'no-console': `error`,
        'no-constant-condition': `error`,
        'no-else-return': [`error`, { allowElseIf: false }],
        'no-eval': `error`,
        'no-iterator': `error`,
        'no-loop-func': `error`,
        'no-multi-assign': `error`,
        'no-nested-ternary': `error`,
        'no-new-object': `error`,
        'no-param-reassign': `error`,
        'no-plusplus': `error`,
        'no-restricted-globals': [`error`, `isNaN`, `isFinite`],
        'no-restricted-syntax': [
          `error`,
          {
            selector: `ForInStatement`,
            message: `for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.`,
          },
          {
            selector: `ForOfStatement`,
            message: `iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.`,
          },
          {
            selector: `ForStatement`,
            message: `Don’t use iterators. Prefer JavaScript’s higher-order functions instead of loops. This enforces our immutable rule. Dealing with pure functions that return values is easier to reason about than side effects.`,
          },
          {
            selector: `LabeledStatement`,
            message: `Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.`,
          },
          {
            selector: `WithStatement`,
            message: `'with' is disallowed in strict mode because it makes code impossible to predict and optimize.`,
          },
        ],
        'no-throw-literal': `error`,
        'no-unneeded-ternary': `error`,
        'no-useless-return': `error`,
        'no-warning-comments': [`error`, { terms: [`todo`] }],
        'object-curly-spacing': [`error`, `always`],
        'object-shorthand': [`error`, `always`],
        'one-var': [`error`, `never`],
        'prefer-const': `error`,
        'prefer-object-spread': `error`,
        'prefer-rest-params': `error`,
        'prefer-template': `error`,
        'spaced-comment': [`error`, `always`],
      },
    },
  ],
};
