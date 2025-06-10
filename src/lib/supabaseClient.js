import { createClient } from '@supabase/supabase-js';

// Função para validar URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Debug detalhado do ambiente
console.group('🔍 Diagnóstico de Inicialização');
console.log('🌐 Ambiente:', {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  base: import.meta.env.BASE_URL
});

// Validação detalhada das variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔑 Variáveis Supabase:', {
  url: {
    defined: !!supabaseUrl,
    valid: isValidUrl(supabaseUrl),
    value: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : undefined
  },
  key: {
    defined: !!supabaseAnonKey,
    valid: !!supabaseAnonKey && supabaseAnonKey.length > 20,
    length: supabaseAnonKey?.length
  }
});

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
  // Validação mais rigorosa
  if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
    throw new Error('URL do Supabase inválida ou não definida');
  }
  
  if (!supabaseAnonKey || supabaseAnonKey.length < 20) {
    throw new Error('Chave anônima do Supabase inválida ou não definida');
  }

  console.log('🔄 Inicializando cliente Supabase...');
  
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
    console.warn(`⚠️ Conexão perdida [${connectionAttempts + 1}/${MAX_CONNECTION_ATTEMPTS}]`, {
      lastError: supabase.realtime.lastError,
      currentState: supabase.realtime.state
    });
    
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
    console.info('✅ Conexão estabelecida', {
      session: !!supabase.auth.session,
      realtimeState: supabase.realtime.state
    });
    connectionAttempts = 0;
    window.dispatchEvent(new CustomEvent('supabase:connected'));
  });

  // Teste inicial de conexão com timeout
  const connectionTimeout = setTimeout(() => {
    console.error('❌ Timeout no teste de conexão');
    window.dispatchEvent(new CustomEvent('supabase:connection-failed'));
  }, 5000);

  testConnection(supabase).then(isConnected => {
    clearTimeout(connectionTimeout);
    if (!isConnected) {
      console.error('❌ Falha no teste de conexão');
      window.dispatchEvent(new CustomEvent('supabase:connection-failed'));
    }
  });

} catch (error) {
  console.error('❌ Erro de inicialização:', {
    message: error.message,
    stack: error.stack?.split('\n')[0],
    url: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'undefined'
  });
  
  console.warn('⚠️ Usando cliente mock');
  supabase = mockClient;
  window.dispatchEvent(new CustomEvent('supabase:initialization-failed', { 
    detail: { error: error.message } 
  }));
} finally {
  console.groupEnd();
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