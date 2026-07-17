import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts on purpose: this project's vite.config.ts
// carries AI-Studio-preview-specific server settings (HMR toggling via
// DISABLE_HMR) that have nothing to do with running the test suite.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
