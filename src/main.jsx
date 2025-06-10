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
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; text-align: center;">
      <h1>Erro de Configuração</h1>
      <p>Variáveis de ambiente ausentes: ${missingEnvVars.join(', ')}</p>
      <p>Por favor, configure as variáveis de ambiente necessárias.</p>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>,
  );
}