import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Info, 
  Eye, 
  ShoppingCart, 
  Heart, 
  Star, 
  Check, 
  Search,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Tipos para las categorías y productos
type ProductCategory = 'todos' | 'aguacates' | 'aceites' | 'cuidado-personal';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string; // Para ofertas, precio tachado
  image: string;
  category: 'aguacates' | 'aceites' | 'cuidado-personal';
  stars?: number; // Calificación de 0 a 5
  featured?: boolean; // Los productos destacados
  badge?: {
    text: string;
    variant: 'default' | 'premium' | 'nuevo' | 'oferta' | 'exclusivo';
  };
};

// Lista de productos de la tienda
const products: Product[] = [
  {
    id: 1,
    name: "Aguacate Hass Premium",
    description: "Nuestro aguacate estrella, con el balance perfecto de cremosidad y sabor.",
    price: "$8.99/kg",
    image: "https://images.unsplash.com/photo-1551460188-2f48af84affa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    category: "aguacates",
    stars: 5,
    featured: true,
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
    category: "aguacates",
    stars: 4.5
  },
  {
    id: 3,
    name: "Caja Gourmet",
    description: "Selección especial de nuestros mejores aguacates en un empaque de lujo.",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "aguacates",
    stars: 5,
    featured: true,
    badge: {
      text: "Gourmet",
      variant: "premium"
    }
  },
  {
    id: 4,
    name: "Aceite de Aguacate Virgen",
    description: "Aceite puro de aguacate prensado en frío, ideal para ensaladas y alta cocina.",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1597281362711-7004802c6881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    category: "aceites",
    stars: 4.5,
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
    originalPrice: "$19.99",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "aceites",
    stars: 4,
    badge: {
      text: "Oferta",
      variant: "oferta"
    }
  },
  {
    id: 6,
    name: "Crema Hidratante",
    description: "Crema facial hidratante con aceite de aguacate, para una piel suave y radiante.",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    category: "cuidado-personal",
    stars: 5,
    badge: {
      text: "Exclusivo",
      variant: "exclusivo"
    }
  },
  {
    id: 7,
    name: "Champú Natural",
    description: "Champú con extracto de aguacate para un cabello nutrido y brillante.",
    price: "$22.99",
    image: "https://images.unsplash.com/photo-1566958769312-82cef41d19ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1529&q=80",
    category: "cuidado-personal",
    stars: 4.5
  },
  {
    id: 8,
    name: "Aceite para Cabello",
    description: "Tratamiento capilar con aceite de aguacate, restaura el cabello dañado.",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "cuidado-personal",
    stars: 4
  }
];

// Función auxiliar para obtener el estilo de la etiqueta según su variante
const getBadgeStyles = (variant: string): string => {
  switch (variant) {
    case 'premium':
      return 'bg-[#C6A96C] text-black';
    case 'nuevo':
      return 'bg-blue-600 text-white';
    case 'oferta':
      return 'bg-red-600 text-white';
    case 'exclusivo':
      return 'bg-purple-600 text-white';
    default:
      return 'bg-[#2D5C34] text-white';
  }
};

// Componente para la tarjeta de producto
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      className="group relative bg-white border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Línea de acento superior */}
      <div className="absolute top-0 left-0 w-0 h-1 bg-[#C6A96C] z-10 group-hover:w-full transition-all duration-500"></div>
      
      {/* Badge / Etiqueta */}
      {product.badge && (
        <div className={`absolute top-3 right-3 z-20 ${getBadgeStyles(product.badge.variant)} py-1 px-3 text-xs uppercase tracking-wider font-medium`}>
          {product.badge.text}
        </div>
      )}
      
      {/* Imagen del producto */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay en hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
        
        {/* Botones de acción rápida */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#2D5C34] hover:bg-[#2D5C34] hover:text-white transition-colors duration-300">
            <Eye size={16} />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#2D5C34] hover:bg-[#2D5C34] hover:text-white transition-colors duration-300">
            <Heart size={16} />
          </button>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#2D5C34] hover:bg-[#2D5C34] hover:text-white transition-colors duration-300">
            <Info size={16} />
          </button>
        </div>
      </div>
      
      {/* Destacado */}
      {product.featured && (
        <div className="absolute top-3 left-3 bg-[#2D5C34] text-white text-xs uppercase tracking-wider py-1 px-3 font-medium">
          Destacado
        </div>
      )}
      
      {/* Contenido del producto */}
      <div className="p-5">
        {/* Estrellas */}
        {product.stars && (
          <div className="flex space-x-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(product.stars || 0) ? "text-[#C6A96C] fill-[#C6A96C]" : "text-gray-300"} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.stars})</span>
          </div>
        )}
        
        {/* Nombre y descripción */}
        <h3 className="font-display text-lg font-bold text-[#2D5C34] mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Precios y botón */}
        <div className="flex justify-between items-center mt-4">
          <div>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through mr-2">{product.originalPrice}</span>
            )}
            <span className="text-[#C6A96C] font-display text-lg font-bold">{product.price}</span>
          </div>
          <Button className="bg-[#2D5C34] hover:bg-[#C6A96C] text-black flex items-center gap-2 transition-all duration-300 force-dark-text">
            <ShoppingCart size={16} />
            <span>Añadir</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Componente para filtrar por categorías
const CategoryFilter = ({ 
  category, 
  activeCategory, 
  onClick 
}: { 
  category: ProductCategory; 
  activeCategory: ProductCategory; 
  onClick: (category: ProductCategory) => void 
}) => {
  // Convertir category a español para mostrar
  const getCategoryName = (cat: ProductCategory) => {
    switch(cat) {
      case 'todos': return 'Todos';
      case 'aguacates': return 'Aguacates';
      case 'aceites': return 'Aceites';
      case 'cuidado-personal': return 'Cuidado Personal';
      default: return cat;
    }
  };
  
  const isActive = category === activeCategory;
  
  return (
    <button 
      onClick={() => onClick(category)}
      className={`px-4 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${
        isActive 
          ? 'bg-[#2D5C34] text-white' 
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {getCategoryName(category)}
    </button>
  );
};

// Componente principal de la tienda
const Tienda = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  // Filtrar productos por categoría y búsqueda
  const filteredProducts = products.filter(product => {
    // Primero filtrar por categoría
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    
    // Luego filtrar por búsqueda si hay un término
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero de la tienda */}
        <section className="relative bg-[#2D5C34] pt-32 pb-20 overflow-hidden" ref={heroRef}>
          {/* Decoración de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#C6A96C] opacity-10"></div>
            <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-[#C6A96C] opacity-5"></div>
            <div className="absolute right-1/4 bottom-0 w-40 h-40 rounded-full border border-[#C6A96C] opacity-10"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Link href="/">
                <a className="text-white/80 inline-flex items-center hover:text-white transition-colors mb-6">
                  <ChevronLeft size={18} />
                  <span className="text-sm ml-1">Volver a Inicio</span>
                </a>
              </Link>
              
              <div className="flex items-center justify-center mb-4">
                <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
                <span className="text-[#C6A96C] text-sm tracking-[0.2em] uppercase font-light">Exclusividad y Calidad</span>
                <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Descubre Nuestra Selección <span className="text-[#C6A96C]">Premium</span>
              </h1>
              
              <p className="text-white/80 max-w-2xl mx-auto mb-10">
                Explora nuestra cuidadosa selección de aguacates y productos derivados 
                de la más alta calidad, cultivados con pasión y tradición ancestral.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full py-6 pl-4 pr-12 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#C6A96C] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
            </motion.div>
          </div>
          
          {/* Divisor de onda en la parte inferior */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden h-16">
            <svg preserveAspectRatio="none" viewBox="0 0 1200 120" className="absolute bottom-0 w-full h-20">
              <path 
                fill="#F9F9F9" 
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity=".25"
              ></path>
              <path 
                fill="#F9F9F9" 
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity=".5"
              ></path>
            </svg>
          </div>
        </section>
        
        {/* Contenido principal */}
        <section className="bg-[#F9F9F9] py-16">
          <div className="container mx-auto px-4">
            {/* Categorías y filtros */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                <CategoryFilter 
                  category="todos" 
                  activeCategory={activeCategory}
                  onClick={setActiveCategory}
                />
                <CategoryFilter 
                  category="aguacates" 
                  activeCategory={activeCategory}
                  onClick={setActiveCategory}
                />
                <CategoryFilter 
                  category="aceites" 
                  activeCategory={activeCategory}
                  onClick={setActiveCategory}
                />
                <CategoryFilter 
                  category="cuidado-personal" 
                  activeCategory={activeCategory}
                  onClick={setActiveCategory}
                />
              </div>
              
              <div className="flex items-center text-gray-600">
                <span className="text-sm mr-2">Mostrando {filteredProducts.length} productos</span>
                <ShoppingBag size={18} />
              </div>
            </div>
            
            {/* Lista de productos */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-700 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No pudimos encontrar productos que coincidan con tu búsqueda. 
                  Intenta con otros términos o categorías.
                </p>
              </div>
            )}
            
            {/* Banner de información adicional */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-100 p-6 flex items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-[#F9F6F0] flex items-center justify-center mr-4 flex-shrink-0">
                  <Check className="text-[#2D5C34]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-800 mb-2">Calidad Garantizada</h3>
                  <p className="text-gray-600 text-sm">Solo seleccionamos los mejores aguacates para garantizar la máxima calidad y frescura.</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-6 flex items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-[#F9F6F0] flex items-center justify-center mr-4 flex-shrink-0">
                  <ShoppingBag className="text-[#2D5C34]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-800 mb-2">Envío Seguro</h3>
                  <p className="text-gray-600 text-sm">Nuestros empaques están diseñados para proteger los productos durante el transporte.</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-6 flex items-start shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-[#F9F6F0] flex items-center justify-center mr-4 flex-shrink-0">
                  <Star className="text-[#2D5C34]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-800 mb-2">Satisfacción 100%</h3>
                  <p className="text-gray-600 text-sm">Si no estás completamente satisfecho, te reembolsamos tu compra sin preguntas.</p>
                </div>
              </div>
            </div>
            
            {/* Banner promocional */}
            <div className="mt-16 bg-[#2D5C34] rounded overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80')] bg-cover bg-center opacity-20"></div>
              <div className="relative z-10 p-10 text-center md:text-left md:flex items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-white font-display text-2xl md:text-3xl font-bold mb-2">¿Quieres probar nuestros productos?</h3>
                  <p className="text-white/80 max-w-xl">Suscríbete a nuestra newsletter y recibe un cupón de 15% de descuento en tu primera compra.</p>
                </div>
                <Link href="/#newsletter">
                  <a className="luxury-button bg-gold force-dark-text inline-flex items-center gap-2">
                    <span>Suscribirme Ahora</span>
                    <ArrowRight size={16} />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tienda;