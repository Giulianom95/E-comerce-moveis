import { createClient } from '@supabase/supabase-js';

// Logs de debug para ambiente e variáveis
console.log('🔧 Ambiente:', import.meta.env.MODE);
console.log('🔑 Variáveis de ambiente carregadas:', {
  url: import.meta.env.VITE_SUPABASE_URL ? 'Definida' : 'Indefinida',
  key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Indefinida'
});

// Implementar fallback para variáveis de ambiente em desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente mock para casos de erro
const mockClient = {
  auth: {
    signIn: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
    signOut: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
  },
  from: () => ({
    select: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
  }),
  storage: {
    from: () => ({
      upload: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
      getPublicUrl: () => ({ data: { publicUrl: null } }),
    }),
  },
};

let supabase;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas');
    throw new Error('As variáveis de ambiente do Supabase são obrigatórias');
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window?.localStorage,
      storageKey: 'supabase_auth',
      sessionTimeout: 14400,
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      },
      reconnect: true,
      timeout: 10000,
      retries: 3
    },
    autoRefreshTime: 13500000,
    persistSession: true,
    headers: {
      'X-Client-Info': 'e-commerce-moveis'
    },
    shouldThrowOnError: false // Mudado para false para evitar crashes
  });

  // Monitor de status da conexão com retry
  let connectionAttempts = 0;
  const MAX_CONNECTION_ATTEMPTS = 3;

  supabase.realtime.on('disconnected', () => {
    console.warn(`⚠️ Conexão com Supabase perdida. Tentativa ${connectionAttempts + 1}/${MAX_CONNECTION_ATTEMPTS}`);
    
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      connectionAttempts++;
      setTimeout(() => {
        console.info('🔄 Tentando reconectar ao Supabase...');
        supabase.realtime.connect();
      }, 1000 * connectionAttempts);
    } else {
      console.error('❌ Número máximo de tentativas de reconexão atingido');
    }
  });

  supabase.realtime.on('connected', () => {
    console.info('✅ Conexão com Supabase estabelecida');
    connectionAttempts = 0;
  });

  // Teste inicial de conexão
  supabase.realtime.connect();

} catch (error) {
  console.error('❌ Erro ao inicializar Supabase:', error);
  console.warn('⚠️ Usando cliente mock para evitar quebra da aplicação');
  supabase = mockClient;
}

export { supabase };

// Funções de upload com tratamento de erro aprimorado
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