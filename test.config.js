import { supabase } from './src/lib/supabaseClient.js';
import { testSupabaseConnection, testProductOperations } from './src/lib/supabaseTest.js';

async function runTests() {
  try {
    console.log('Iniciando testes do Supabase...\n');
    
    // Teste de conexão
    const connectionResult = await testSupabaseConnection();
    if (!connectionResult) {
      throw new Error('Falha no teste de conexão');
    }
    
    // Teste de operações com produtos
    await testProductOperations();
    
    console.log('\nTodos os testes foram concluídos com sucesso! ✅');
  } catch (error) {
    console.error('\nFalha nos testes:', error.message);
    process.exit(1);
  }
}

runTests();
