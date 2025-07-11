import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: process.env.NODE_ENV === 'development',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for core React libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // UI libraries chunk
            if (id.includes('flowbite') || id.includes('framer-motion') || id.includes('react-icons')) {
              return 'ui-vendor';
            }
            
            // Chart libraries chunk
            if (id.includes('apexcharts') || id.includes('recharts') || id.includes('d3') || id.includes('nivo')) {
              return 'charts-vendor';
            }
            
            // Redux and state management
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'state-vendor';
            }
            
            // Date and utility libraries
            if (id.includes('date-fns') || id.includes('axios') || id.includes('yup')) {
              return 'utils-vendor';
            }
            
            // Stripe and payment libraries
            if (id.includes('stripe')) {
              return 'payment-vendor';
            }
            
            // Other vendor libraries
            return 'vendor';
          }
          
          // Dashboard components chunk
          if (id.includes('/src/components/dashboard') || id.includes('/src/screens')) {
            return 'dashboard';
          }
          
          // Authentication components chunk
          if (id.includes('/src/pages') && (id.includes('Login') || id.includes('Register') || id.includes('Auth'))) {
            return 'auth';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${chunkInfo.name || facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Optimize build performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'date-fns',
      'axios',
    ],
  },
})
