import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (e) {
      console.error("Error fetching products:", e);
      setError(e.message);
      toast({
        title: 'Erro ao carregar produtos',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    if (!user?.email?.includes('@admin')) {
      toast({ title: 'Não autorizado', description: 'Apenas administradores podem adicionar produtos.', variant: 'destructive' });
      return null;
    }
    try {
      const productPayload = {
        ...productData,
        price: parseFloat(productData.price),
        stock_quantity: parseInt(productData.stock_quantity, 10),
      };

      const { data, error: insertError } = await supabase
        .from('products')
        .insert([productPayload])
        .select()
        .single();

      if (insertError) throw insertError;
      
      setProducts(prev => [data, ...prev]);
      toast({ title: 'Sucesso!', description: 'Produto adicionado.' });
      return data;
    } catch (e) {
      console.error("Error adding product:", e);
      toast({ title: 'Erro ao adicionar produto', description: e.message, variant: 'destructive' });
      return null;
    }
  };

  const updateProduct = async (productId, productData) => {
     if (!user) {
      toast({ title: 'Não autorizado', description: 'Você precisa estar logado.', variant: 'destructive' });
      return null;
    }
    try {
      const productPayload = {
        ...productData,
        price: parseFloat(productData.price),
        stock_quantity: parseInt(productData.stock_quantity, 10),
        updated_at: new Date().toISOString(), // Manually set updated_at if trigger is not reliable for all cases
      };
      // Remove id and created_at, added_by from payload if they exist, as they shouldn't be updated directly
      delete productPayload.id;
      delete productPayload.created_at;
      delete productPayload.added_by;


      const { data, error: updateError } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', productId)
        .select()
        .single();
      
      if (updateError) throw updateError;

      setProducts(prev => prev.map(p => p.id === productId ? data : p));
      toast({ title: 'Sucesso!', description: 'Produto atualizado.' });
      return data;
    } catch (e) {
      console.error("Error updating product:", e);
      toast({ title: 'Erro ao atualizar produto', description: e.message, variant: 'destructive' });
      return null;
    }
  };

  const deleteProduct = async (productId) => {
    if (!user) {
      toast({ title: 'Não autorizado', description: 'Você precisa estar logado.', variant: 'destructive' });
      return false;
    }
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) throw deleteError;

      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: 'Sucesso!', description: 'Produto excluído.' });
      return true;
    } catch (e) {
      console.error("Error deleting product:", e);
      toast({ title: 'Erro ao excluir produto', description: e.message, variant: 'destructive' });
      return false;
    }
  };
  

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};