module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  resetMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!src/main.js',
    '!src/registerServiceWorker.js'
  ]
};
