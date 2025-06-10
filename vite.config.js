import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		compression({
			algorithm: 'brotliCompress',
			threshold: 1024 // Comprimir arquivos maiores que 1KB
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		sourcemap: false,
		outDir: 'dist',
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
				passes: 2
			},
			mangle: {
				toplevel: true
			}
		},
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Pacote de vendors para React e relacionados
					if (id.includes('node_modules/react') || 
						id.includes('node_modules/react-dom') || 
						id.includes('node_modules/react-router') ||
						id.includes('node_modules/react-hot-toast')) {
						return 'vendor-react';
					}
					
					// Pacote Supabase
					if (id.includes('node_modules/@supabase')) {
						return 'vendor-supabase';
					}

					// Pacote de UI components
					if (id.includes('src/components/ui/')) {
						return 'ui-components';
					}

					// Pacote principal de componentes
					if (id.includes('src/components/')) {
						return 'components';
					}

					// Contextos da aplicação
					if (id.includes('src/contexts/')) {
						return 'contexts';
					}

					// Páginas da aplicação
					if (id.includes('src/pages/')) {
						return 'pages';
					}

					// Outros módulos do node_modules
					if (id.includes('node_modules/')) {
						return 'vendor';
					}
				}
			}
		},
		chunkSizeWarningLimit: 800
	},
});
