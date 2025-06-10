import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zvvkpitdjefpltrifvqz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dmtpaXRkamVmcGx0cmlmdnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODExNzQsImV4cCI6MjA2NDQ1NzE3NH0.0Uife_sCzS_i2IvbVFNfiPZPlu0dlwKPxZQZ6T3Vgjk';

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

export const uploadProductImage = async (file, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`produtos/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(`produtos/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};