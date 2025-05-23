import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      rollupTypes: true,
      outDir: 'dist',
      tsconfigPath: resolve(__dirname, './tsconfig.json'),
      insertTypesEntry: true,
      clearPureImport: true,
      entryRoot: 'src'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BookwhenClient', // This is mainly for UMD, can be kept or removed for ESM-only
      fileName: () => 'index.js', // Output ESM as index.js
      formats: ['es'] // Explicitly set to only 'es'
    },
    rollupOptions: {
      external: [], // Bundle axios and zod
      output: // Keep only the ESM output configuration
        {
          format: 'es',
          exports: 'named',
          preserveModules: false, // Good for ESM
          inlineDynamicImports: false, // Add this line
          globals: { // Less relevant for ESM library, but harmless
            axios: 'axios',
            zod: 'zod'
          }
        }
    },
    target: 'es2020',
    minify: false,
    sourcemap: true
  }
});
