import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		react(),
		compression({
			algorithm: 'brotliCompress',
			exclude: [/\.(br)$/, /\.(gz)$/],
			deleteOriginalAssets: false,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		sourcemap: mode === 'development',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: mode === 'production',
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor': [
						'react',
						'react-dom',
						'react-router-dom',
						'@supabase/supabase-js',
					],
					'ui': Object.keys(require('./package.json').dependencies).filter(
						pkg => pkg.startsWith('@radix-ui') || pkg.startsWith('lucide-react')
					),
				},
			},
		},
		chunkSizeWarningLimit: 800
	},
	server: {
		host: true,
		port: 3000,
	},
}));
