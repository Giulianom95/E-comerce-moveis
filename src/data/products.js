const products = [
  {
    id: 1,
    name: 'Sofá Moderno Premium',
    description: 'Sofá de 3 lugares com design contemporâneo e tecido de alta qualidade. Perfeito para salas modernas.',
    price: 2499.99,
    category: 'sofas',
    image: 'Modern premium sofa with contemporary design',
    rating: 4.8,
    featured: true
  },
  {
    id: 2,
    name: 'Mesa de Jantar Elegante',
    description: 'Mesa de jantar em madeira maciça para 6 pessoas. Design clássico e durabilidade excepcional.',
    price: 1899.99,
    category: 'mesas',
    image: 'Elegant wooden dining table for 6 people',
    rating: 4.7,
    featured: true
  },
  {
    id: 3,
    name: 'Cadeira Ergonômica Office',
    description: 'Cadeira de escritório com design ergonômico e ajustes personalizáveis para máximo conforto.',
    price: 899.99,
    category: 'cadeiras',
    image: 'Ergonomic office chair with adjustable features',
    rating: 4.6,
    featured: false
  },
  {
    id: 4,
    name: 'Cama Box King Size',
    description: 'Cama box king size com colchão ortopédico incluído. Ideal para um sono reparador.',
    price: 3299.99,
    category: 'camas',
    image: 'King size box bed with orthopedic mattress',
    rating: 4.9,
    featured: true
  },
  {
    id: 5,
    name: 'Armário Guarda-Roupa 6 Portas',
    description: 'Armário espaçoso com 6 portas e espelho. Organização perfeita para seu quarto.',
    price: 1599.99,
    category: 'armarios',
    image: 'Large 6-door wardrobe with mirror',
    rating: 4.5,
    featured: false
  },
  {
    id: 6,
    name: 'Poltrona Reclinável Luxo',
    description: 'Poltrona reclinável em couro sintético com massageador integrado. Conforto máximo.',
    price: 1799.99,
    category: 'sofas',
    image: 'Luxury reclining armchair with massage function',
    rating: 4.8,
    featured: true
  },
  {
    id: 7,
    name: 'Mesa de Centro Vidro',
    description: 'Mesa de centro com tampo de vidro temperado e base em aço inox. Design minimalista.',
    price: 699.99,
    category: 'mesas',
    image: 'Glass coffee table with stainless steel base',
    rating: 4.4,
    featured: false
  },
  {
    id: 8,
    name: 'Conjunto de Cadeiras Jantar',
    description: 'Conjunto com 4 cadeiras estofadas para mesa de jantar. Elegância e conforto.',
    price: 1299.99,
    category: 'cadeiras',
    image: 'Set of 4 upholstered dining chairs',
    rating: 4.6,
    featured: false
  },
  {
    id: 9,
    name: 'Cama Solteiro com Gavetas',
    description: 'Cama de solteiro com gavetas integradas para otimizar o espaço do quarto.',
    price: 899.99,
    category: 'camas',
    image: 'Single bed with integrated storage drawers',
    rating: 4.3,
    featured: false
  },
  {
    id: 10,
    name: 'Estante Biblioteca Moderna',
    description: 'Estante alta com 5 prateleiras em MDF. Ideal para livros e decoração.',
    price: 799.99,
    category: 'armarios',
    image: 'Modern tall bookshelf with 5 shelves',
    rating: 4.5,
    featured: false
  },
  {
    id: 11,
    name: 'Sofá Retrátil 2 Lugares',
    description: 'Sofá retrátil e reclinável para 2 pessoas. Perfeito para relaxar assistindo TV.',
    price: 1899.99,
    category: 'sofas',
    image: 'Retractable and reclining 2-seater sofa',
    rating: 4.7,
    featured: false
  },
  {
    id: 12,
    name: 'Mesa Escritório Executiva',
    description: 'Mesa executiva em L com gavetas e suporte para CPU. Ideal para home office.',
    price: 1199.99,
    category: 'mesas',
    image: 'Executive L-shaped office desk with drawers',
    rating: 4.6,
    featured: false
  },
  {
    id: 13,
    name: 'Banqueta Bar Giratória',
    description: 'Banqueta giratória com altura ajustável. Perfeita para bancadas e bares.',
    price: 299.99,
    category: 'cadeiras',
    image: 'Adjustable swivel bar stool',
    rating: 4.2,
    featured: false
  },
  {
    id: 14,
    name: 'Beliche Infantil Colorido',
    description: 'Beliche em madeira com escorregador e cores vibrantes. Diversão garantida.',
    price: 1599.99,
    category: 'camas',
    image: 'Colorful wooden bunk bed with slide',
    rating: 4.8,
    featured: false
  },
  {
    id: 15,
    name: 'Rack TV 60 Polegadas',
    description: 'Rack para TV até 60 polegadas com nichos para equipamentos. Design moderno.',
    price: 899.99,
    category: 'armarios',
    image: 'Modern TV stand for 60-inch television',
    rating: 4.4,
    featured: false
  },
  {
    id: 16,
    name: 'Chaise Longue Veludo',
    description: 'Chaise longue em veludo azul marinho com pés dourados. Elegância pura.',
    price: 1399.99,
    category: 'sofas',
    image: 'Navy blue velvet chaise longue with gold legs',
    rating: 4.9,
    featured: true
  },
  {
    id: 17,
    name: 'Luminária de Chão Industrial',
    description: 'Luminária de chão com design industrial, acabamento em metal preto e cúpula ajustável.',
    price: 450.00,
    category: 'decoracao',
    image: 'Industrial style floor lamp black metal',
    rating: 4.6,
    featured: true
  }
];

export const getAllProducts = () => products;

export const getProductById = (id) => products.find(product => product.id === id);

export const getFeaturedProducts = () => products.filter(product => product.featured);

export const getProductsByCategory = (category) => 
  products.filter(product => product.category === category);

export const getRelatedProducts = (category, excludeId, limit = 4) => 
  products
    .filter(product => product.category === category && product.id !== excludeId)
    .slice(0, limit);

export const searchProducts = (query) => 
  products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );