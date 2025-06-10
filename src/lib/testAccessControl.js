import { supabaseTest } from './supabaseTestClient';

async function setupAdminUser() {
  try {
    // Tentar fazer login com o usuário admin existente
    const { data: signInData, error: signInError } = await supabaseTest.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'admin@admin.com'
    });

    if (signInError) {
      console.error('❌ Erro ao fazer login como admin:', signInError.message);
      return false;
    }

    console.log('✅ Login como admin realizado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao acessar conta admin:', error.message);
    return false;
  }
}

async function testAccessControl() {
  try {
    console.log('🔄 Testando controle de acesso...\n');

    // Teste 1: Buscar produtos (deve funcionar para todos)
    console.log('1️⃣ Testando acesso público aos produtos...');
    const { data: products, error: productsError } = await supabaseTest
      .from('products')
      .select('*')
      .limit(1);

    if (productsError) {
      console.error('❌ Erro ao buscar produtos:', productsError.message);
    } else {
      console.log('✅ Acesso público aos produtos OK');
      if (products.length > 0) {
        console.log('Exemplo de produto:', products[0]);
      } else {
        console.log('Nenhum produto encontrado');
      }
    }

    // Teste 2: Tentar adicionar um produto sem autenticação (deve falhar)
    console.log('\n2️⃣ Testando adicionar produto sem autenticação...');
    const testProduct = {
      name: 'Teste Não Autorizado',
      description: 'Este produto não deve ser adicionado',
      price: 100,
      stock: 1
    };

    const { data: unauthorizedInsert, error: insertError } = await supabaseTest
      .from('products')
      .insert([testProduct])
      .select();

    if (insertError) {
      console.log('✅ Inserção não autorizada bloqueada corretamente:', insertError.message);
    } else {
      console.error('❌ Falha na segurança: produto foi inserido sem autorização');
      // Se o produto foi inserido, vamos removê-lo
      if (unauthorizedInsert?.[0]?.id) {
        await supabaseTest
          .from('products')
          .delete()
          .eq('id', unauthorizedInsert[0].id);
      }
    }

    // Teste 3: Configurar e testar usuário admin
    console.log('\n3️⃣ Configurando e testando privilégios de admin...');
    const adminConfigured = await setupAdminUser();

    if (adminConfigured) {
      // Tentar adicionar um produto como admin
      const adminProduct = {
        name: 'Teste Admin',
        description: 'Este produto deve ser adicionado',
        price: 100,
        stock: 1,
        category: 'teste'
      };

      const { data: adminInsert, error: adminInsertError } = await supabaseTest
        .from('products')
        .insert([adminProduct])
        .select();

      if (adminInsertError) {
        console.log('❌ Admin não conseguiu adicionar produto:', adminInsertError.message);
      } else {
        console.log('✅ Admin adicionou produto com sucesso');
        // Limpar o produto de teste
        if (adminInsert?.[0]?.id) {
          await supabaseTest
            .from('products')
            .delete()
            .eq('id', adminInsert[0].id);
          console.log('✅ Produto de teste removido com sucesso');
        }
      }
    }

    console.log('\n✅ Testes de controle de acesso concluídos!');
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error.message);
  }
}

// Executar os testes
testAccessControl();
