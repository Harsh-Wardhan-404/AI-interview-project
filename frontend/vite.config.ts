import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // Base URL for production
    base: '/',

    // Build Configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // Optimize dependencies
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['framer-motion', 'lucide-react'],
          },
        },
      },
      // Minify options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },

    // Server Configuration
    server: {
      port: 5173,
      host: true,
      strictPort: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/fastapi': {
          target: env.VITE_FASTAPI_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fastapi/, ''),
        },
      },
    },

    // Preview Configuration
    preview: {
      port: 4173,
      host: true,
      strictPort: true,
    },

    // Resolve Configuration
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // Optimization Configuration
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
    },

    // Environment Variables Configuration
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    // CSS Configuration
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    // EsLint Configuration
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
  };
});