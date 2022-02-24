module.exports = {
  '*.js': ['npm run lint:eslint', 'npm run lint:prettier', 'git add', 'npm run test:unit'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['npm run lint:prettier', 'git add'],
  'package.json': ['npm run lint:prettier', 'git add'],
  '*.vue': ['npm run lint:eslint', 'npm run lint:stylelint', 'npm run lint:prettier', 'git add', 'npm run test:unit'],
  '*.scss': ['npm run lint:stylelint', 'npm run lint:prettier', 'git add'],
  '*.md': ['npm run lint:markdownlint', 'npm run lint:prettier', 'git add'],
  '*.{png,jpeg,jpg,gif,svg}': ['imagemin-lint-staged', 'git add']
};
