import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    build: {
        sourcemap: false,
        outDir: 'build',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            // Proxy requests starting with /wasm to your backend on localhost:4000
            '/wasm': {
                target: 'http://localhost:4000/',
                changeOrigin: true,
                rewrite: function (path) { return path; },
                // Optional: rewrite the path if your backend expects a different route
                // rewrite: (path) => path.replace(/^\/wasm/, '/wasm'),
            },
            // You can add more proxies here if needed
        },
    },
});
