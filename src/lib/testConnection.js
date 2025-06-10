import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epxankmtukyjyybltajm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweGFua210dWt5anl5Ymx0YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjMxODcsImV4cCI6MjA2NTA5OTE4N30.AWZbb2v6-lRgmqoXVJEyfa8CPIuf3WHpT2yljz-Hgc8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPublicOperations() {
  try {
    console.log('🔄 Iniciando testes de operações públicas...\n');

    // Teste 1: Verificar acesso à tabela products
    console.log('1️⃣ Verificando acesso à tabela products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.log('❌ Erro ao acessar produtos:', productsError.message);
    } else {
      console.log('✅ Acesso à tabela products OK');
      console.log(`📊 Total de produtos: ${products.length}`);
      
      if (products.length > 0) {
        console.log('\nExemplo de produto:');
        console.log(JSON.stringify(products[0], null, 2));
      } else {
        console.log('\nNenhum produto encontrado na tabela');
      }
    }

    // Teste 2: Tentar filtrar produtos por categoria
    console.log('\n2️⃣ Testando filtro por categoria...');
    const { data: filteredProducts, error: filterError } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'sofas');

    if (filterError) {
      console.log('❌ Erro ao filtrar produtos:', filterError.message);
    } else {
      console.log('✅ Filtro por categoria OK');
      console.log(`📊 Produtos na categoria 'sofas': ${filteredProducts.length}`);
    }

    // Teste 3: Tentar ordenar produtos por preço
    console.log('\n3️⃣ Testando ordenação por preço...');
    const { data: sortedProducts, error: sortError } = await supabase
      .from('products')
      .select('name, price')
      .order('price', { ascending: true })
      .limit(5);

    if (sortError) {
      console.log('❌ Erro ao ordenar produtos:', sortError.message);
    } else {
      console.log('✅ Ordenação por preço OK');
      if (sortedProducts.length > 0) {
        console.log('\nProdutos mais baratos:');
        sortedProducts.forEach(p => console.log(`- ${p.name}: R$ ${p.price}`));
      }
    }

    console.log('\n✅ Testes de operações públicas concluídos!');
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error.message);
  }
}

// Executar os testes
console.log('Conectando ao Supabase...');
console.log('URL:', supabaseUrl);
testPublicOperations();
