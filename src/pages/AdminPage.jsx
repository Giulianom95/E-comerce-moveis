import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Edit3, Trash2, List, Users, Settings, Package, DollarSign, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadProductImage } from '@/lib/supabaseClient';

const definedCategories = ['utilidades', 'roupeiros', 'comodas', 'mesa', 'cadeira', 'sofa', 'decoracao', 'camas', 'armarios'];

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    image_url: product?.image_url || '',
    stock_quantity: product?.stock_quantity || 0,
    featured: product?.featured || false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.image_url || null);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.price || !formData.category || !formData.stock_quantity) {
        toast({ 
          title: "Campos obrigatórios", 
          description: "Nome, preço, categoria e quantidade em estoque são obrigatórios.", 
          variant: "destructive"
        });
        return;
      }

      let imageUrl = formData.image_url;
      
      // Se temos um novo arquivo selecionado, vamos fazer o upload
      if (selectedFile) {
        // Criar nome único para o arquivo
        const fileName = `${Date.now()}-${formData.name.toLowerCase().replace(/ /g, '-')}.jpg`;
        
        // Fazer upload e obter URL pública
        imageUrl = await uploadProductImage(selectedFile, fileName);
      }

      // Enviar dados do produto com a URL da imagem do Storage
      await onSubmit({ 
        ...formData, 
        image_url: imageUrl,
        added_by: user.id 
      });

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({ 
        title: "Erro", 
        description: "Ocorreu um erro ao salvar o produto. Tente novamente.", 
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 p-6 bg-white rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold gradient-text mb-6">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
           <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {definedCategories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
          <Input id="stock_quantity" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="image">Imagem do Produto</Label>
          <Input 
            id="image" 
            name="image" 
            type="file" 
            accept="image/jpeg,image/jpg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                // Criar preview local
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
              }
            }}
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-[200px] h-auto rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))} />
        <Label htmlFor="featured">Produto em Destaque</Label>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
          {product ? 'Salvar Alterações' : 'Adicionar Produto'}
        </Button>
      </div>
    </motion.form>
  );
};


const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(productId);
    }
  };

  const handleFormSubmit = async (data) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    setShowForm(false);
    setEditingProduct(null);
  };
  
  const AdminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos', icon: List },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 p-4 sm:p-8">
      <div className="container mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2 text-lg">Gerencie sua loja DormeBem com facilidade.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.aside 
            className="lg:w-64 bg-white p-6 rounded-xl shadow-lg space-y-3 h-fit lg:sticky lg:top-24"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {AdminTabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`w-full justify-start text-base py-3 px-4 ${activeTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </Button>
            ))}
          </motion.aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-semibold text-gray-800">Gerenciar Produtos</h2>
                  <Button onClick={handleAddNew} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>

                {showForm && (
                  <ProductForm
                    product={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                  />
                )}

                <div className="mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Lista de Produtos</h3>
                  {productsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
                      <p className="mt-3 text-gray-500">Carregando produtos...</p>
                    </div>
                  ) : products.length === 0 ? (
                     <p className="text-gray-500 text-center py-6">Nenhum produto cadastrado ainda.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-max text-left">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="p-3 font-medium text-gray-600">Nome</th>
                            <th className="p-3 font-medium text-gray-600">Categoria</th>
                            <th className="p-3 font-medium text-gray-600">Preço</th>
                            <th className="p-3 font-medium text-gray-600">Estoque</th>
                            <th className="p-3 font-medium text-gray-600">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="p-3 text-gray-700">{product.name}</td>
                              <td className="p-3 text-gray-700">{product.category}</td>
                              <td className="p-3 text-gray-700">R$ {product.price.toFixed(2)}</td>
                              <td className="p-3 text-gray-700">{product.stock_quantity}</td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)} className="text-red-600 border-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {activeTab !== 'products' && (
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                  {AdminTabs.find(t => t.id === activeTab)?.label || 'Página'}
                </h2>
                <p className="text-gray-600 text-lg">Funcionalidade em desenvolvimento.</p>
                <div className="mt-6">
                  {(AdminTabs.find(t => t.id === activeTab)?.icon) && 
                    React.createElement(AdminTabs.find(t => t.id === activeTab)?.icon, { className: "w-24 h-24 text-pink-400 mx-auto opacity-50" })
                  }
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;