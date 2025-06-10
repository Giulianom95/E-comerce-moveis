import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		sourcemap: true,
		outDir: 'dist',
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react-hot-toast')) {
							return 'vendor';
						}
						return 'deps';
					}
					if (id.includes('/components/')) {
						return 'components';
					}
					if (id.includes('/pages/')) {
						return 'pages';
					}
				}
			}
		},
		chunkSizeWarningLimit: 800
	},
});
