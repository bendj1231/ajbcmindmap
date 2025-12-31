import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1600,
    },
    define: {
      // Define process.env to prevent "ReferenceError: process is not defined"
      // and inject the API_KEY from Vercel/environment.
      'process.env': JSON.stringify({
        API_KEY: env.API_KEY,
        NODE_ENV: mode,
      }),
    },
  };
});