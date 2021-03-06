// @ts-check

const { configHelpers } = require('./packages/eslint-plugin/src/index');
const { prettierExtensions } = require('./scripts/prettier/prettier-helpers');

// remove leading . for consistency with prettierExtensions
const eslintExtensions = configHelpers.extensions.map(ext => ext.slice(1));

const nonEslintPrettierExtensions = prettierExtensions.filter(ext => !eslintExtensions.includes(ext));

// https://www.npmjs.com/package/lint-staged
module.exports = {
  // Run eslint in fix mode followed by prettier
  [`*.{${eslintExtensions.join(',')}}`]: ['node ./scripts/lint-staged/eslint', 'node ./scripts/format.js'],

  // Run prettier on non-eslintable files (ignores handled by .prettierignore)
  [`*.{${nonEslintPrettierExtensions.join(',')}}`]: 'node ./scripts/format.js',

  'common/changes/*.json': 'node ./scripts/lint-staged/auto-convert-change-files',

  '**/tslint.json': 'node ./scripts/lint-staged/no-tslint-json',

  '**/package.json': 'node ./scripts/lint-staged/no-tslint-deps',

  'packages/!(react-examples)/!(fluentui)/**/(docs|examples)/*.{ts,tsx,scss,md}':
    'node ./scripts/lint-staged/no-old-example-paths',
  'packages/!(react-examples)/!(fluentui)/**/*.doc.ts*': 'node ./scripts/lint-staged/no-old-example-paths',
  'packages/{react,react-cards,react-focus}/src/components/__snapshots__/*':
    'node ./scripts/lint-staged/no-old-snapshot-paths',
};
