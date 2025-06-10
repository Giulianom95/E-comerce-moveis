import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';

function initializeApp() {
  try {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
        <Toaster />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    document.getElementById('root').innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1 style="color: #EF4444; margin-bottom: 16px;">Erro ao carregar a aplicação</h1>
        <p>Tente recarregar a página. Se o erro persistir, entre em contato com o suporte.</p>
        <button onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar
        </button>
      </div>
    `;
  }
}

// Validação das variáveis de ambiente
try {
  const requiredEnvVars = {
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY
  };

  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    console.warn('⚠️ Algumas variáveis de ambiente estão ausentes:', missingEnvVars.join(', '));
  }
} catch (error) {
  console.warn('⚠️ Erro ao verificar variáveis de ambiente:', error);
}

initializeApp();