import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ProductCategory = 'todos' | 'aguacates' | 'aceites' | 'cuidado-personal';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'aguacates' | 'aceites' | 'cuidado-personal';
  badge?: {
    text: string;
    variant: 'default' | 'premium' | 'nuevo' | 'oferta';
  };
};

const products: Product[] = [
  {
    id: 1,
    name: "Aguacate Hass Premium",
    description: "Nuestro aguacate estrella, con el balance perfecto de cremosidad y sabor.",
    price: "$8.99/kg",
    image: "https://images.unsplash.com/photo-1551460188-2f48af84affa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "aguacates",
    badge: {
      text: "Premium",
      variant: "premium"
    }
  },
  {
    id: 2,
    name: "Aguacate Orgánico",
    description: "Cultivado sin pesticidas ni aditivos químicos, conservando todo su sabor natural.",
    price: "$10.99/kg",
    image: "https://images.unsplash.com/photo-1573566291259-fd494a326b60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "aguacates"
  },
  {
    id: 3,
    name: "Caja Gourmet",
    description: "Selección especial de nuestros mejores aguacates en un empaque de lujo.",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "aguacates",
    badge: {
      text: "Gourmet",
      variant: "premium"
    }
  },
  {
    id: 4,
    name: "Aceite de Aguacate Virgen",
    description: "Aceite puro de aguacate prensado en frío, ideal para ensaladas y alta cocina.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1597281362711-7004802c6881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    category: "aceites",
    badge: {
      text: "Nuevo",
      variant: "nuevo"
    }
  },
  {
    id: 5,
    name: "Aceite Infusionado con Ajo",
    description: "Aceite de aguacate infusionado con ajo orgánico, perfecto para marinados.",
    price: "$17.99",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "aceites"
  },
  {
    id: 6,
    name: "Crema Hidratante",
    description: "Crema facial hidratante con aceite de aguacate, para una piel suave y radiante.",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    category: "cuidado-personal"
  },
  {
    id: 7,
    name: "Champú Natural",
    description: "Champú con extracto de aguacate para un cabello nutrido y brillante.",
    price: "$22.99",
    image: "https://images.unsplash.com/photo-1566958769312-82cef41d19ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1529&q=80",
    category: "cuidado-personal"
  },
  {
    id: 8,
    name: "Aceite para Cabello",
    description: "Tratamiento capilar con aceite de aguacate, restaura el cabello dañado.",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "cuidado-personal",
    badge: {
      text: "Oferta",
      variant: "oferta"
    }
  }
];

const getBadgeStyles = (variant: string) => {
  switch (variant) {
    case 'premium':
      return 'bg-[#C6A96C] hover:bg-[#C6A96C]/80';
    case 'nuevo':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'oferta':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-[#2D5C34] hover:bg-[#2D5C34]/80';
  }
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-4 right-4">
            <Badge className={`${getBadgeStyles(product.badge.variant)}`}>
              {product.badge.text}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-[#2D5C34] mb-2">{product.name}</h3>
        <p className="text-gray-600 font-body mb-4 text-sm">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#C6A96C] font-display text-lg font-bold">{product.price}</span>
          <Button className="bg-[#2D5C34] hover:bg-[#2D5C34]/90 text-white flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>Añadir</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryButton = ({ 
  active, 
  category, 
  label, 
  onClick 
}: { 
  active: boolean; 
  category: ProductCategory; 
  label: string; 
  onClick: (category: ProductCategory) => void 
}) => (
  <button
    onClick={() => onClick(category)}
    className={`px-6 py-2 transition-colors duration-300 text-sm uppercase tracking-wider border ${
      active 
        ? 'bg-[#2D5C34] text-white border-[#2D5C34]' 
        : 'bg-transparent text-[#2D5C34] border-[#2D5C34] hover:bg-[#2D5C34]/10'
    }`}
  >
    {label}
  </button>
);

const Tienda = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');

  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <section className="bg-[#F9F6F0] py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
              <div>
                <Link href="/" className="inline-flex items-center text-[#2D5C34] hover:text-[#C6A96C] transition-colors duration-300 mb-4">
                  <ArrowLeft size={16} className="mr-2" />
                  <span>Volver a Inicio</span>
                </Link>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2D5C34]">Nuestra Tienda</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <CategoryButton 
                  active={activeCategory === 'todos'} 
                  category='todos' 
                  label='Todos' 
                  onClick={setActiveCategory} 
                />
                <CategoryButton 
                  active={activeCategory === 'aguacates'} 
                  category='aguacates' 
                  label='Aguacates' 
                  onClick={setActiveCategory} 
                />
                <CategoryButton 
                  active={activeCategory === 'aceites'} 
                  category='aceites' 
                  label='Aceites' 
                  onClick={setActiveCategory} 
                />
                <CategoryButton 
                  active={activeCategory === 'cuidado-personal'} 
                  category='cuidado-personal' 
                  label='Cuidado Personal' 
                  onClick={setActiveCategory} 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No hay productos disponibles en esta categoría.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tienda;