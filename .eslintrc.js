module.exports = {
  ignorePatterns: [
    // Files starting with '.' are ignored by default and must be explicitly
    // included
    `!.eslintrc.js`,
    `!.lintstagedrc.js`,
  ],
  overrides: [
    {
      files: `*.{js,ts,tsx}`,
      // Tell ESLint that our files are running in a Node environment so
      // it doesn't complain about Node features like `module.exports`
      env: { node: true },
      parserOptions: { ecmaVersion: 2018 },
      extends: [`eslint:recommended`, `prettier`],
      plugins: [`filenames`],
      rules: {
        'arrow-body-style': [`error`, `always`],
        'arrow-parens': [`error`, `always`],
        curly: [`error`, `all`],
        'dot-notation': `error`,
        eqeqeq: `error`,
        'filenames/match-regex': [`error`, `^[A-Za-z0-9.]+$`],
        'filenames/match-exported': `error`,
        'func-style': [`error`, `expression`, { allowArrowFunctions: true }],
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
        'no-warning-comments': [
          `error`,
          {
            terms: [`xxx`],
          },
        ],
        'object-curly-spacing': [`error`, `always`],
        'object-shorthand': [`error`, `always`],
        'one-var': [`error`, `never`],
        'prefer-const': `error`,
        'prefer-object-spread': `error`,
        'prefer-rest-params': `error`,
        'prefer-template': `error`,
        quotes: [`error`, `backtick`],
        'spaced-comment': [`error`, `always`],
      },
    },
  ],
};
