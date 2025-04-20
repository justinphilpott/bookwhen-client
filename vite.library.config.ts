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
      name: 'BookwhenClient',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['axios', 'zod'],
      output: {
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
