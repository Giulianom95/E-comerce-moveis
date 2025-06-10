import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
  try {
    // Teste 1: Verificar conexão com o Supabase
    const { data, error } = await supabase.from('products').select('count').single();
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
    // Teste 2: Criar um produto de teste
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

    // Teste 3: Buscar o produto criado
    const { data: fetchedProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', createdProduct.id)
      .single();

    if (fetchError) throw fetchError;
    console.log('✅ Produto recuperado com sucesso:', fetchedProduct);

    // Teste 4: Atualizar o produto
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ price: 89.99 })
      .eq('id', createdProduct.id)
      .select()
      .single();

    if (updateError) throw updateError;
    console.log('✅ Produto atualizado com sucesso:', updatedProduct);

    // Teste 5: Deletar o produto de teste
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

export async function testOrderOperations() {
  try {
    // Teste 6: Criar um pedido de teste
    const testOrder = {
      user_id: '123', // Substitua por um ID de usuário válido
      total_amount: 99.99,
      shipping_address: {
        address: 'Rua Teste, 123',
        city: 'Cidade Teste',
        state: 'ST',
        zipCode: '12345-678',
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        phone: '11999999999'
      },
      status: 'pending'
    };

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (orderError) throw orderError;
    console.log('✅ Pedido criado com sucesso:', createdOrder);

    // Teste 7: Criar itens do pedido
    const testOrderItem = {
      order_id: createdOrder.id,
      product_id: 1, // Substitua por um ID de produto válido
      quantity: 1,
      unit_price: 99.99
    };

    const { data: createdOrderItem, error: itemError } = await supabase
      .from('order_items')
      .insert([testOrderItem])
      .select()
      .single();

    if (itemError) throw itemError;
    console.log('✅ Item do pedido criado com sucesso:', createdOrderItem);

    return true;
  } catch (error) {
    console.error('❌ Erro nas operações de pedido:', error.message);
    return false;
  }
}

// Função principal para executar todos os testes
export async function runAllTests() {
  console.log('🔄 Iniciando testes do Supabase...');
  
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest) {
    console.error('❌ Falha na conexão com Supabase. Abortando demais testes.');
    return false;
  }

  const productTest = await testProductOperations();
  if (!productTest) {
    console.error('❌ Falha nos testes de produtos.');
    return false;
  }

  const orderTest = await testOrderOperations();
  if (!orderTest) {
    console.error('❌ Falha nos testes de pedidos.');
    return false;
  }

  console.log('✅ Todos os testes completados com sucesso!');
  return true;
}
