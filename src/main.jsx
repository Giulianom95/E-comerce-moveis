import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';

// Validação das variáveis de ambiente
const requiredEnvVars = {
  'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error('❌ Variáveis de ambiente ausentes:', missingEnvVars.join(', '));
  const rootElement = document.getElementById('root') || document.body;
  rootElement.innerHTML = `
    <div style="
      padding: 20px;
      color: #EF4444;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #F9FAFB;
    ">
      <h1 style="font-size: 24px; margin-bottom: 16px;">⚠️ Erro de Configuração</h1>
      <p style="margin-bottom: 16px;">As seguintes variáveis de ambiente estão faltando:</p>
      <ul style="list-style: none; padding: 0; margin-bottom: 16px;">
        ${missingEnvVars.map(v => `<li style="margin: 8px 0; padding: 8px 16px; background: #FEE2E2; border-radius: 4px;">${v}</li>`).join('')}
      </ul>
      <p>Por favor, configure as variáveis de ambiente necessárias no arquivo .env</p>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>
  );
}