import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Award,
  Truck,
  Search,
  Plus,
  Minus,
  ChevronDown,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
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
  originalPrice?: string;
  image: string;
  gallery?: string[];
  rating: number;
  reviewCount: number;
  category: 'aguacates' | 'aceites' | 'cuidado-personal';
  badge?: {
    text: string;
    variant: 'default' | 'premium' | 'nuevo' | 'oferta';
  };
  details?: {
    origen?: string;
    peso?: string;
    variedad?: string;
    uso?: string;
    beneficios?: string[];
  };
  bestseller?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    name: "Aguacate Hass Premium",
    description: "Nuestro aguacate estrella, con el balance perfecto de cremosidad y sabor.",
    price: "S/8.99/kg",
    image: "/images/Aguacate Hass Premium.jpeg",
    gallery: [
      "/images/Aguacate Hass Premium.jpeg"
    ],
    rating: 4.9,
    reviewCount: 128,
    category: "aguacates",
    badge: {
      text: "Premium",
      variant: "premium"
    },
    details: {
      origen: "Valles andinos, Perú",
      peso: "250-300g por unidad",
      variedad: "Hass",
      uso: "Ideal para guacamole, tostadas y ensaladas",
      beneficios: ["Rico en grasas saludables", "Alto contenido de potasio", "Vitaminas E, K y B"]
    },
    bestseller: true
  },
  {
    id: 2,
    name: "Aguacate Orgánico",
    description: "Cultivado sin pesticidas ni aditivos químicos, conservando todo su sabor natural.",
    price: "S/10.99/kg",
    originalPrice: "S/12.99/kg",
    image: "/images/Aguacate Organico.jpeg",
    gallery: [
      "/images/Aguacate Organico.jpeg"
    ],
    rating: 4.8,
    reviewCount: 93,
    category: "aguacates",
    details: {
      origen: "Valles andinos, Perú",
      peso: "250-300g por unidad",
      variedad: "Hass Orgánico",
      uso: "Ideal para consumo directo y recetas gourmet",
      beneficios: ["Certificación orgánica", "Sin residuos de pesticidas", "Sabor más intenso"]
    }
  },
  {
    id: 3,
    name: "Aguacate fuerte Premium",
    description: "Selección especial de nuestros mejores aguacates en un empaque de lujo.",
    price: "S/24.99",
    image: "/images/Aguacate fuerte Premium.jpeg",
    gallery: [
      "/images/Aguacate fuerte Premium.jpeg"
    ],
    rating: 5.0,
    reviewCount: 42,
    category: "aguacates",
    badge: {
      text: "Premium",
      variant: "premium"
    },
    details: {
      origen: "Selección especial, Perú",
      peso: "Pack de 6 unidades (1.5kg aprox.)",
      variedad: "Fuerte Premium",
      uso: "Ideal para regalos y eventos especiales",
      beneficios: ["Presentación de lujo", "Aguacates seleccionados", "Maduración perfecta garantizada"]
    }
  },
  {
    id: 4,
    name: "Aceite de Aguacate Virgen",
    description: "Aceite puro de aguacate prensado en frío, ideal para ensaladas y alta cocina.",
    price: "S/15.99",
    image: "/images/Aceite de aguacate virgen.jpeg",
    gallery: [
      "/images/Aceite de aguacate virgen.jpeg"
    ],
    rating: 4.7,
    reviewCount: 76,
    category: "aceites",
    badge: {
      text: "Nuevo",
      variant: "nuevo"
    },
    details: {
      origen: "Proceso artesanal, Perú",
      peso: "250ml",
      variedad: "Extra Virgen",
      uso: "Ideal para aliños, marinados y finalizar platos",
      beneficios: ["Alto punto de humo", "Rico en grasas monoinsaturadas", "Sin colesterol"]
    },
    bestseller: true
  },
  {
    id: 5,
    name: "Aceite Infusionado con Ajo",
    description: "Aceite de aguacate infusionado con ajo orgánico, perfecto para marinados.",
    price: "S/17.99",
    image: "/images/Aceite infusionado con Ajo.jpeg",
    gallery: [
      "/images/Aceite infusionado con Ajo.jpeg"
    ],
    rating: 4.9,
    reviewCount: 54,
    category: "aceites",
    details: {
      origen: "Proceso artesanal, Perú",
      peso: "200ml",
      variedad: "Infusionado con hierbas",
      uso: "Ideal para finalizar platos y alta cocina",
      beneficios: ["Infusionado naturalmente", "Sabor intenso y aromático", "Sin aditivos artificiales"]
    }
  },
  {
    id: 6,
    name: "Crema Hidratante",
    description: "Crema facial hidratante con aceite de aguacate, para una piel suave y radiante.",
    price: "S/29.99",
    originalPrice: "S/34.99",
    image: "/images/Crema hidratante de aguacate.jpeg",
    gallery: [
      "/images/Crema hidratante de aguacate.jpeg"
    ],
    rating: 4.8,
    reviewCount: 112,
    category: "cuidado-personal",
    badge: {
      text: "Oferta",
      variant: "oferta"
    },
    details: {
      origen: "Laboratorio especializado, Perú",
      peso: "200ml",
      variedad: "Crema hidratante intensiva",
      uso: "Aplicar diariamente sobre piel limpia",
      beneficios: ["Hidratación profunda", "Con vitamina E", "Sin parabenos"]
    }
  },
  {
    id: 7,
    name: "Champú Natural",
    description: "Champú con extracto de aguacate para un cabello nutrido y brillante.",
    price: "S/22.99",
    image: "/images/Shampoo de aguacate natural.jpeg",
    gallery: [
      "/images/Shampoo de aguacate natural.jpeg"
    ],
    rating: 4.6,
    reviewCount: 89,
    category: "cuidado-personal",
    details: {
      origen: "Laboratorio especializado, Perú",
      peso: "300ml",
      variedad: "Champú nutritivo",
      uso: "Para todo tipo de cabello, especialmente dañado",
      beneficios: ["Repara puntas abiertas", "Aporta brillo natural", "Fortalece el cabello"]
    }
  },
  {
    id: 8,
    name: "Aceite para Cabello",
    description: "Tratamiento capilar con aceite de aguacate, restaura el cabello dañado.",
    price: "S/19.99",
    image: "/images/Aceite de aguacate para el cabello.jpeg",
    gallery: [
      "/images/Aceite de aguacate para el cabello.jpeg"
    ],
    rating: 4.9,
    reviewCount: 76,
    category: "cuidado-personal",
    badge: {
      text: "Premium",
      variant: "premium"
    },
    details: {
      origen: "Laboratorio especializado, Perú",
      peso: "100ml",
      variedad: "Tratamiento rejuvenecedor",
      uso: "Aplicar 1-2 veces por semana",
      beneficios: ["Efecto nutritivo", "Con vitaminas E y C", "Hidratación profunda"]
    },
    bestseller: true
  }
];

// Modal de producto detallado
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

const ProductModal = ({
  product,
  onClose
}: {
  product: Product | null;
  onClose: () => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) return null;

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${
        product ? "" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal container - Rediseñado para imitar exactamente el modal de Galería Gourmet */}
      <div className="relative bg-white rounded-lg w-full max-w-6xl shadow-lg flex flex-col md:flex-row h-[85vh]">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Columna de imagen - Estática, sin scroll, ocupando toda la altura */}
        <div className="md:w-1/2 h-full relative">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Columna de información - Con scroll independiente */}
        <div className="md:w-1/2 h-full overflow-y-auto">
          <div className="p-8">
            {/* Insignias y bestseller en una sola línea */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.bestseller && (
                <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium tracking-wider flex items-center gap-1">
                  <Award size={12} />
                  <span>BESTSELLER</span>
                </div>
              )}
              {product.badge && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white tracking-wider ${getBadgeStyles(product.badge.variant)}`}>
                  {product.badge.text.toUpperCase()}
                </div>
              )}
            </div>

            {/* Nombre del producto */}
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-3">{product.name}</h2>

            {/* Calificación en formato simplificado */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reseñas)
              </span>
            </div>

            {/* Descripción */}
            <p className="text-gray-700 mb-6 text-base leading-relaxed">{product.description}</p>

            {/* Precio con formato grande */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-[#2D5C34]">{product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through text-base">{product.originalPrice}</span>
              )}
            </div>

            {/* Divisor visual */}
            <div className="w-full h-px bg-gray-200 my-6"></div>

            {/* Detalles del producto - Diseño simplificado */}
            {product.details && (
              <div className="mb-8">
                <h3 className="font-display text-xl font-bold text-gray-800 mb-4">Detalles del producto</h3>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {product.details.origen && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Origen:</span>
                      <div className="text-gray-800">{product.details.origen}</div>
                    </div>
                  )}
                  {product.details.peso && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Peso:</span>
                      <div className="text-gray-800">{product.details.peso}</div>
                    </div>
                  )}
                  {product.details.variedad && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Variedad:</span>
                      <div className="text-gray-800">{product.details.variedad}</div>
                    </div>
                  )}
                  {product.details.uso && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Uso:</span>
                      <div className="text-gray-800">{product.details.uso}</div>
                    </div>
                  )}
                </div>

                {/* Beneficios */}
                {product.details.beneficios && product.details.beneficios.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Beneficios:</h4>
                    <ul className="space-y-2">
                      {product.details.beneficios.map((beneficio, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Sparkles size={16} className="text-[#C6A96C] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Acciones - Al final de la página */}
            <div className="mt-auto pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={handleDecrement}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-10 text-center py-2 font-medium text-gray-800">
                    {quantity}
                  </div>
                  <button
                    className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={handleIncrement}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <Button className="flex-1 bg-[#2D5C34] hover:bg-[#1F4425] text-white py-2 rounded-md text-sm">
                  <ShoppingCart size={16} className="mr-2" />
                  <span>Añadir al carrito</span>
                </Button>
              </div>

              {/* Entrega - Estilo minimalista */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck size={16} />
                <span>Envío gratis en pedidos superiores a S/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  onClick,
  index = 0
}: {
  product: Product;
  onClick: () => void;
  index?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeStyles = (variant?: string) => {
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

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 h-full"
      onClick={onClick}
    >
      <div className="relative pt-[100%] overflow-hidden bg-[#f8f8f8]">
        <motion.img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex mb-2 items-center">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-2">({product.reviewCount})</span>
        </div>

        <h3 className="text-lg font-bold text-[#2D5C34] mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-[#C6A96C] font-bold text-lg">{product.price}</div>
            {product.originalPrice && (
              <div className="text-gray-500 text-sm line-through">{product.originalPrice}</div>
            )}
          </div>
          <button className="bg-transparent border border-[#2D5C34] text-[#2D5C34] group-hover:bg-[#2D5C34] group-hover:text-white p-2 rounded-full transition-all duration-300">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
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
    className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-full border transition-colors whitespace-nowrap ${
      active
        ? "bg-[#2D5C34] text-white border-[#2D5C34]"
        : "border-[#2D5C34] text-[#2D5C34] hover:bg-[#2D5C34] hover:text-white"
    }`}
  >
    {label}
  </button>
);

// Sección de filtros ajustada para móvil
const SortButton = ({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xs sm:text-sm whitespace-nowrap transition-all duration-200 py-1.5 px-2 sm:px-3 rounded-full ${
      active
        ? 'bg-[#2D5C34]/10 text-[#2D5C34] font-medium'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const Tienda = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSort, setActiveSort] = useState<string>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Filter products by category
  const filteredProducts = activeCategory === 'todos'
    ? products
    : products.filter(product => product.category === activeCategory);

  // Sort products based on active sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (activeSort) {
      case 'popular':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case 'newest':
        return b.id - a.id;
      case 'price-low':
        return parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, ''));
      case 'price-high':
        return parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, ''));
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 md:pt-24 overflow-hidden">
        {/* Hero section */}
        <section className="relative bg-[#2D5C34] py-12 md:py-24 overflow-hidden" ref={ref}>
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-10 bg-pattern"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-300 mb-4 md:mb-8">
                <ArrowLeft size={16} className="mr-2" />
                <span>Volver a Inicio</span>
              </Link>

              <div className="flex items-center justify-center mb-2 md:mb-4">
                <div className="h-[1px] w-6 md:w-10 bg-[#C6A96C] mr-2 md:mr-3"></div>
                <span className="text-[#C6A96C] text-xs md:text-sm tracking-[0.2em] uppercase font-light">Exclusividad y Calidad</span>
                <div className="h-[1px] w-6 md:w-10 bg-[#C6A96C] ml-2 md:ml-3"></div>
              </div>

              <h1 className="text-white font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">
                Descubre Nuestra <span className="text-[#C6A96C]">Colección Premium</span>
              </h1>

              <p className="text-white/80 mb-6 md:mb-12 text-sm md:text-lg leading-relaxed px-2">
                Nuestra exclusiva selección de productos de aguacate, elaborados bajo los más estrictos
                estándares de calidad, sostenibilidad y excelencia.
              </p>
            </motion.div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#F9F6F0">
              <path d="M0,0 C240,70 480,100 720,100 C960,100 1200,70 1440,0 L1440,100 L0,100 Z"></path>
            </svg>
          </div>
        </section>

        {/* Filter section */}
        <section className="py-6 md:py-12 bg-[#F9F6F0]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-3 md:gap-6">
              <motion.div
                className="flex flex-wrap gap-2 md:gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
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
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-1 text-[#2D5C34] font-medium text-sm py-1.5 px-3 bg-white/80 rounded-full shadow-sm w-full max-w-[160px] justify-center"
                >
                  <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  <span>Ordenar por</span>
                </button>

                {/* Desktop sort buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="text-[#2D5C34] font-medium flex items-center gap-2 text-sm">
                    <ChevronDown size={16} />
                    <span>Ordenar por:</span>
                  </div>
                  <div className="flex space-x-1">
                    <SortButton
                      label="Más populares"
                      active={activeSort === 'popular'}
                      onClick={() => setActiveSort('popular')}
                    />
                    <SortButton
                      label="Novedades"
                      active={activeSort === 'newest'}
                      onClick={() => setActiveSort('newest')}
                    />
                    <SortButton
                      label="Precio: Menor a mayor"
                      active={activeSort === 'price-low'}
                      onClick={() => setActiveSort('price-low')}
                    />
                    <SortButton
                      label="Precio: Mayor a menor"
                      active={activeSort === 'price-high'}
                      onClick={() => setActiveSort('price-high')}
                    />
                  </div>
                </div>

                {/* Mobile sort buttons dropdown */}
                <div className={`md:hidden w-full ${showFilters ? 'flex' : 'hidden'} flex-wrap gap-1 justify-center`}>
                  <SortButton
                    label="Más populares"
                    active={activeSort === 'popular'}
                    onClick={() => {
                      setActiveSort('popular');
                      setShowFilters(false);
                    }}
                  />
                  <SortButton
                    label="Novedades"
                    active={activeSort === 'newest'}
                    onClick={() => {
                      setActiveSort('newest');
                      setShowFilters(false);
                    }}
                  />
                  <SortButton
                    label="Precio: Menor"
                    active={activeSort === 'price-low'}
                    onClick={() => {
                      setActiveSort('price-low');
                      setShowFilters(false);
                    }}
                  />
                  <SortButton
                    label="Precio: Mayor"
                    active={activeSort === 'price-high'}
                    onClick={() => {
                      setActiveSort('price-high');
                      setShowFilters(false);
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-6 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-4 md:mb-6 flex justify-between items-center">
              <motion.h2
                className="text-lg md:text-2xl font-display font-bold text-[#2D5C34]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {activeCategory === 'todos' ? 'Todos los Productos' :
                 activeCategory === 'aguacates' ? 'Aguacates Premium' :
                 activeCategory === 'aceites' ? 'Aceites Gourmet' : 'Cuidado Personal'}
              </motion.h2>

              <motion.div
                className="text-gray-600 text-xs md:text-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                Mostrando {sortedProducts.length} productos
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                  index={index}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No hay productos disponibles en esta categoría.</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer banner */}
        <section className="bg-[#F9F6F0] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-lg p-8 md:p-12 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#C6A96C]/20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[#C6A96C]/20"></div>

              <div className="md:flex justify-between items-center gap-8 relative z-10">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center mb-2">
                    <Sparkles size={16} className="text-[#C6A96C] mr-2" />
                    <span className="text-[#C6A96C] text-sm tracking-[0.2em] uppercase font-light">Experiencia Premium</span>
                  </div>
                  <h2 className="text-[#2D5C34] font-display text-3xl font-bold mb-4">¿Necesitas asesoramiento personalizado?</h2>
                  <p className="text-gray-600 mb-0">Nuestros expertos pueden ayudarte a elegir los productos que mejor se adapten a tus necesidades específicas.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="border border-[#2D5C34] bg-white text-[#2D5C34] hover:bg-[#2D5C34] hover:text-white px-6 py-3"
                    onClick={() => window.open('https://wa.link/reqscn', '_blank')}
                  >
                    Contacta con nosotros
                  </Button>
                  <Button
                    className="bg-[#2D5C34] text-white border-[#2D5C34] px-6 py-3 flex items-center gap-2"
                    onClick={() => window.open('https://wa.link/reqscn', '_blank')}
                  >
                    <span>Catálogo completo</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      <Footer />

      {/* El CSS para el fondo con patrón lo hemos movido a un estilo inline en el propio div con clase .bg-pattern */}
    </div>
  );
};

export default Tienda;