import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths'; // To support paths from tsconfig
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Automatically resolves TypeScript paths
  ],
  server: {
    port: 3000, // Custom server port
    open: true, // Automatically open the browser on server start
  },
  test: {
    globals: true, // Enables global test APIs like 'describe', 'it'
    environment: 'node', // Change to 'jsdom' for browser-like testing
    mockReset: true, // Resets mocks between tests
    coverage: {
      provider: 'v8', // Use 'c8' for coverage reports
      reporter: ['text', 'json', 'html'], // Custom coverage report formats
    },
    exclude: [...configDefaults.exclude], // Exclude default files (node_modules, etc.)
  },
  resolve: {
    alias: {
      '@': '/src', // Simple path aliasing
    },
  },
});
