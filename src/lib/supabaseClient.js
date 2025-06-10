import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente do Supabase são obrigatórias. Por favor, configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase_auth',
    // Define um tempo maior para a sessão (4 horas)
    sessionTimeout: 14400, // 4 horas em segundos
  },
  // Configurações adicionais do cliente
  realtime: {
    params: {
      eventsPerSecond: 10
    },
    // Configurações de reconexão
    reconnect: true,
    timeout: 10000, // 10 segundos
    retries: 3
  },
  // Define um tempo maior para o refresh do token (3 horas e 45 minutos)
  autoRefreshTime: 13500000, // 3.75 horas em milissegundos
  persistSession: true,
  // Configurações de rede
  headers: {
    'X-Client-Info': 'e-commerce-moveis'
  },
  // Configurações de cache
  shouldThrowOnError: true, // Lança erros em vez de retornar { error }
});

// Monitor de status da conexão
supabase.realtime.on('disconnected', () => {
  console.warn('⚠️ Conexão com Supabase perdida. Tentando reconectar...');
});

supabase.realtime.on('connected', () => {
  console.info('✅ Conexão com Supabase estabelecida');
});

// Funções de upload
export const uploadProductImage = async (file, fileName, onProgress) => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Configurar o upload com progresso
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`produtos/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            if (onProgress) {
              const percentage = (progress.loaded / progress.total) * 100;
              onProgress(Math.round(percentage));
            }
          },
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`produtos/${fileName}`);

      return publicUrl;
    } catch (error) {
      attempt++;
      if (attempt === MAX_RETRIES) {
        console.error('Erro ao fazer upload da imagem após várias tentativas:', error);
        throw new Error(
          'Não foi possível fazer o upload da imagem. Por favor, tente novamente ou use uma imagem diferente.'
        );
      }
      // Esperar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};