import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.test.ts'],
    typecheck: { enabled: false },
    tsconfig: './tsconfig.test.json',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        'tests/',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  define: {
    'process.client': 'true',
  },
  // Use esbuild instead of oxc transformer
  esbuild: {
    target: 'es2022',
  },
})
