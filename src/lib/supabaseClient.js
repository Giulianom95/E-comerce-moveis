import { createClient } from '@supabase/supabase-js';

// Logs de debug para ambiente e variáveis
console.log('🔧 Ambiente:', import.meta.env.MODE);
console.log('🌐 URL Base:', import.meta.env.VITE_SUPABASE_URL);
console.log('🔑 Variáveis de ambiente:', {
  url: import.meta.env.VITE_SUPABASE_URL ? 'Definida' : 'Indefinida',
  key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Indefinida'
});

// Implementar fallback para variáveis de ambiente em desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Função para testar a conexão
const testConnection = async (client) => {
  try {
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erro ao testar conexão:', error.message);
      throw error;
    }
    
    console.info('✅ Conexão com banco de dados testada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Falha no teste de conexão:', error);
    return false;
  }
};

// Cliente mock para casos de erro
const mockClient = {
  auth: {
    signIn: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
    signOut: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
    onAuthStateChange: (callback) => {
      console.warn('⚠️ Usando cliente mock - autenticação indisponível');
      return { unsubscribe: () => {} };
    }
  },
  from: () => ({
    select: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
    insert: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
    update: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
    delete: () => Promise.reject(new Error('Cliente Supabase não inicializado corretamente')),
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

  console.info('🔄 Inicializando cliente Supabase...');
  
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
    db: {
      schema: 'public'
    },
    global: {
      fetch: fetch.bind(globalThis),
      headers: {
        'X-Client-Info': 'e-commerce-moveis',
        'X-Client-Site': window?.location?.hostname
      }
    }
  });

  // Monitor de status da conexão com retry
  let connectionAttempts = 0;
  const MAX_CONNECTION_ATTEMPTS = 3;

  supabase.realtime.on('disconnected', async () => {
    console.warn(`⚠️ Conexão com Supabase perdida. Tentativa ${connectionAttempts + 1}/${MAX_CONNECTION_ATTEMPTS}`);
    
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      connectionAttempts++;
      setTimeout(async () => {
        console.info('🔄 Tentando reconectar ao Supabase...');
        await supabase.realtime.connect();
        const isConnected = await testConnection(supabase);
        if (!isConnected && connectionAttempts === MAX_CONNECTION_ATTEMPTS) {
          console.error('❌ Falha na reconexão após todas as tentativas');
          window.dispatchEvent(new CustomEvent('supabase:connection-failed'));
        }
      }, 1000 * Math.pow(2, connectionAttempts)); // Exponential backoff
    } else {
      console.error('❌ Número máximo de tentativas de reconexão atingido');
      window.dispatchEvent(new CustomEvent('supabase:connection-failed'));
    }
  });

  supabase.realtime.on('connected', () => {
    console.info('✅ Conexão com Supabase estabelecida');
    connectionAttempts = 0;
    window.dispatchEvent(new CustomEvent('supabase:connected'));
  });

  // Teste inicial de conexão
  testConnection(supabase).then(isConnected => {
    if (!isConnected) {
      console.error('❌ Falha no teste inicial de conexão');
      window.dispatchEvent(new CustomEvent('supabase:connection-failed'));
    }
  });

} catch (error) {
  console.error('❌ Erro ao inicializar Supabase:', error);
  console.warn('⚠️ Usando cliente mock para evitar quebra da aplicação');
  supabase = mockClient;
  window.dispatchEvent(new CustomEvent('supabase:initialization-failed', { 
    detail: { error: error.message } 
  }));
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