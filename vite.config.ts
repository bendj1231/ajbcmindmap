import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1600,
    },
    define: {
      // Specifically replace the API key access with the string value
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Provide a fallback for other process.env accesses
      'process.env': JSON.stringify({
        NODE_ENV: mode,
        ...env
      }),
      // Polyfill global process if needed by dependencies
      'process.browser': true,
    },
  };
});