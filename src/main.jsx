import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabaseClient';

async function initializeApp() {
  try {
    // Testa a conexão com o Supabase
    const { error } = await supabase.from('products').select('count', { count: 'exact' });
    if (error) throw error;

    // Se chegou aqui, a conexão está ok
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
        <Toaster />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    document.getElementById('root').innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to bottom right, #f8fafc, #e0f2fe, #f3e8ff);
        font-family: system-ui, -apple-system, sans-serif;
        padding: 20px;
        text-align: center;
      ">
        <h1 style="color: #dc2626; font-size: 24px; margin-bottom: 16px;">
          ⚠️ Erro ao carregar a aplicação
        </h1>
        <p style="color: #374151; margin-bottom: 16px;">
          Não foi possível conectar ao banco de dados. Por favor, verifique sua conexão e tente novamente.
        </p>
        <button onclick="window.location.reload()" style="
          background: #3b82f6;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        ">
          Tentar Novamente
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