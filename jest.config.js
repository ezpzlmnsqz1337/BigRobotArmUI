module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/EventBus.ts',
    '!src/registerServiceWorker.ts',
    '!src/main.ts',
    '!src/shared.ts',
    '!src/store/store.ts',
    '!src/constants/**/*',
    '!src/plugins/**/*',
    '!src/router/**/*',
    '!src/assets/**/*'
  ]
}
