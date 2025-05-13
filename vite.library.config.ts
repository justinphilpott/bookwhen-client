import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts']
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['axios', 'zod'], // Ensure dependencies are external
      output: {
        // globals are mainly for UMD/IIFE with externals, less relevant here
        // but harmless to keep for now.
        globals: {
          axios: 'axios',
          zod: 'zod'
        }
      }
    },
    target: 'esnext',
    minify: false,
    sourcemap: true
  }
});
