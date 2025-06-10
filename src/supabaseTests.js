import { createClient } from '@supabase/supabase-js';
import fetch from 'cross-fetch';
globalThis.fetch = fetch;

const supabaseUrl = 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count');
    if (error) throw error;
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com Supabase:', error.message);
    return false;
  }
}

export async function testProductOperations() {
  try {
    // Teste: Criar um produto de teste
    const testProduct = {
      name: 'Produto Teste',
      description: 'Produto para teste de integração',
      price: 99.99,
      stock: 10,
      category: 'teste'
    };

    const { data: createdProduct, error: createError } = await supabase
      .from('products')
      .insert([testProduct])
      .select()
      .single();

    if (createError) throw createError;
    console.log('✅ Produto criado com sucesso:', createdProduct);

    // Teste: Buscar o produto criado
    const { data: fetchedProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', createdProduct.id)
      .single();

    if (fetchError) throw fetchError;
    console.log('✅ Produto recuperado com sucesso:', fetchedProduct);

    // Teste: Atualizar o produto
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ price: 89.99 })
      .eq('id', createdProduct.id)
      .select()
      .single();

    if (updateError) throw updateError;
    console.log('✅ Produto atualizado com sucesso:', updatedProduct);

    // Teste: Deletar o produto
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', createdProduct.id);

    if (deleteError) throw deleteError;
    console.log('✅ Produto deletado com sucesso');

    return true;
  } catch (error) {
    console.error('❌ Erro nas operações de produto:', error.message);
    return false;
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🔄 Iniciando testes do Supabase...\n');

  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    console.error('❌ Falha no teste de conexão. Abortando...');
    return;
  }

  const productsOk = await testProductOperations();
  if (!productsOk) {
    console.error('❌ Falha nos testes de produtos');
    return;
  }

  console.log('\n✅ Todos os testes foram concluídos com sucesso!');
}

// Executar testes
runAllTests();
