import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não encontradas. Usando valores padrão.');
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
    }
  },
  // Define um tempo maior para o refresh do token (3 horas e 45 minutos)
  autoRefreshTime: 13500000, // 3.75 horas em milissegundos
});

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