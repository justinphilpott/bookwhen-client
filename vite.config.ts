import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  server: {
      port: 3000,
      open: true,
      watch: {
        ignored: ['**/tests/browser/**'],
      },
    },
    test: {
    globals: true,
    environment: 'node',
    mockReset: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist/**',
        'src/types/**',
        'coverage/**',
        '*.config.*',
        'services/event/EventInterfaces.ts',
        'services/event/EventTypes.ts',
        '**/*.{spec,test}.{js,ts,jsx,tsx}'
      ]
    },
    exclude: [
      ...configDefaults.exclude,
      '**/tests/browser/**' // Exclude Playwright browser tests
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
