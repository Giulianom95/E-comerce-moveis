import { supabase } from './supabaseClient';

// Produtos
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Pedidos
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: orderData.userId,
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        status: 'pending'
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createOrderItems = async (orderItems) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();
  
  if (error) throw error;
  return data;
};

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
