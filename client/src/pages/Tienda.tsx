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
  Sparkles
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
    price: "$8.99/kg",
    image: "https://images.unsplash.com/photo-1551460188-2f48af84affa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551460188-2f48af84affa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1075&q=80",
      "https://images.unsplash.com/photo-1590311980589-3cb93d1512f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
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
    price: "$10.99/kg",
    originalPrice: "$12.99/kg",
    image: "https://images.unsplash.com/photo-1573566291259-fd494a326b60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1573566291259-fd494a326b60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80"
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
    name: "Caja Gourmet",
    description: "Selección especial de nuestros mejores aguacates en un empaque de lujo.",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1565591452825-67d6b7df1d47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    ],
    rating: 5.0,
    reviewCount: 42,
    category: "aguacates",
    badge: {
      text: "Gourmet",
      variant: "premium"
    },
    details: {
      origen: "Selección especial, Perú",
      peso: "Pack de 6 unidades (1.5kg aprox.)",
      variedad: "Hass Premium",
      uso: "Ideal para regalos y eventos especiales",
      beneficios: ["Presentación de lujo", "Aguacates seleccionados", "Maduración perfecta garantizada"]
    }
  },
  {
    id: 4,
    name: "Aceite de Aguacate Virgen",
    description: "Aceite puro de aguacate prensado en frío, ideal para ensaladas y alta cocina.",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1597281362711-7004802c6881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597281362711-7004802c6881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      "https://images.unsplash.com/photo-1584559582128-b8be739912e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
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
    price: "$17.99",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1543364195-bfe6e4932397?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
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
    price: "$29.99",
    originalPrice: "$34.99",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
      "https://images.unsplash.com/photo-1626784215021-2e914fad9749?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
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
    price: "$22.99",
    image: "https://images.unsplash.com/photo-1566958769312-82cef41d19ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1529&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566958769312-82cef41d19ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1529&q=80",
      "https://images.unsplash.com/photo-1594348586711-637bb8830ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
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
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1526758097130-bec957c521b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
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
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-auto rounded-lg p-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="bg-[#F9F6F0] p-8 flex flex-col">
            <div className="relative aspect-square overflow-hidden mb-4 border border-gray-100 rounded-lg bg-white">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-contain p-4" 
              />
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className={`${getBadgeStyles(product.badge.variant)} text-white`}>
                    {product.badge.text}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.gallery?.map((img, index) => (
                <button 
                  key={index}
                  className={`aspect-square w-20 flex-shrink-0 border ${selectedImage === img ? 'border-[#C6A96C]' : 'border-gray-200'} rounded-md overflow-hidden bg-white hover:border-[#C6A96C] transition-all`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product details */}
          <div className="p-8 flex flex-col">
            <div className="mb-4">
              {product.bestseller && (
                <div className="text-[#C6A96C] text-sm tracking-wider uppercase mb-2 flex items-center gap-1">
                  <Award size={14} />
                  <span>Bestseller</span>
                </div>
              )}
              
              <h2 className="text-3xl font-display font-bold text-[#333333] mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reseñas)
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">{product.description}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#2D5C34]">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Product details */}
            {product.details && (
              <div className="border-t border-gray-200 py-6 mb-6">
                <h3 className="font-display text-lg font-bold text-[#333333] mb-4">Detalles del producto</h3>
                <div className="space-y-3">
                  {product.details.origen && (
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-600 w-28">Origen:</span>
                      <span className="text-sm text-gray-800">{product.details.origen}</span>
                    </div>
                  )}
                  {product.details.peso && (
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-600 w-28">Peso:</span>
                      <span className="text-sm text-gray-800">{product.details.peso}</span>
                    </div>
                  )}
                  {product.details.variedad && (
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-600 w-28">Variedad:</span>
                      <span className="text-sm text-gray-800">{product.details.variedad}</span>
                    </div>
                  )}
                  {product.details.uso && (
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-600 w-28">Uso:</span>
                      <span className="text-sm text-gray-800">{product.details.uso}</span>
                    </div>
                  )}
                </div>
                
                {product.details.beneficios && product.details.beneficios.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Beneficios:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {product.details.beneficios.map((beneficio, index) => (
                        <li key={index} className="text-sm text-gray-800">{beneficio}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    className="p-2 text-gray-600 hover:bg-gray-100"
                    onClick={handleDecrement}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="px-4 py-2 text-center min-w-[40px]">{quantity}</div>
                  <button 
                    className="p-2 text-gray-600 hover:bg-gray-100"
                    onClick={handleIncrement}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button className="flex-1 bg-[#2D5C34] text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-[#2D5C34]/90 transition-colors">
                  <ShoppingCart size={18} />
                  <span>Añadir al carrito</span>
                </button>
                
                <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  <Heart size={18} className="text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center text-center">
                  <Truck size={18} className="text-[#2D5C34] mb-1" />
                  <span className="font-medium">Envío gratuito</span>
                  <span className="text-gray-500 text-xs">En pedidos +$50</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award size={18} className="text-[#2D5C34] mb-1" />
                  <span className="font-medium">Calidad garantizada</span>
                  <span className="text-gray-500 text-xs">Certificación premium</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Search size={18} className="text-[#2D5C34] mb-1" />
                  <span className="font-medium">Trazabilidad</span>
                  <span className="text-gray-500 text-xs">Origen verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
    <motion.div
      ref={ref}
      className="product-card relative bg-white overflow-hidden group transition-all duration-300 hover:shadow-xl border border-transparent hover:border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Golden accent line */}
      <div className="absolute top-0 left-0 w-0 h-1 bg-[#C6A96C] z-10 group-hover:w-full transition-all duration-500"></div>
      
      <div className="relative overflow-hidden h-64">
        <motion.img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
          animate={{ 
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <button 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#2D5C34] py-2 px-4 rounded-full font-medium transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#2D5C34] hover:text-white flex items-center gap-2 shadow-lg"
          >
            <Search size={16} />
            <span>Ver detalles</span>
          </button>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <Badge className={`${getBadgeStyles(product.badge.variant)} text-white uppercase tracking-wider text-xs font-medium shadow-md`}>
              {product.badge.text}
            </Badge>
          </div>
        )}

        {/* Bestseller badge */}
        {product.bestseller && (
          <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full shadow-md flex items-center gap-1">
            <Award size={12} className="text-[#C6A96C]" />
            <span className="text-xs font-medium text-[#2D5C34]">Bestseller</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
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
    className={`transition-all duration-300 py-3 px-6 text-sm uppercase tracking-wider ${
      active 
        ? 'bg-[#2D5C34] text-white border-b-2 border-[#C6A96C] shadow-md' 
        : 'bg-white text-[#2D5C34] hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

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
    className={`text-sm transition-all duration-200 py-1.5 px-3 rounded-full ${
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
      
      <main className="flex-grow pt-24">
        {/* Hero section */}
        <section className="relative bg-[#2D5C34] py-24 overflow-hidden" ref={ref}>
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-10 bg-pattern"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-300 mb-8">
                <ArrowLeft size={16} className="mr-2" />
                <span>Volver a Inicio</span>
              </Link>
              
              <div className="flex items-center justify-center mb-4">
                <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
                <span className="text-[#C6A96C] text-sm tracking-[0.2em] uppercase font-light">Exclusividad y Calidad</span>
                <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
              </div>
              
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-6">
                Descubre Nuestra <span className="text-[#C6A96C]">Colección Premium</span>
              </h1>
              
              <p className="text-white/80 mb-12 text-lg leading-relaxed">
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
        <section className="py-12 bg-[#F9F6F0]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <CategoryButton 
                  active={activeCategory === 'todos'} 
                  category='todos' 
                  label='Todos los Productos' 
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
                className="flex items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="text-[#2D5C34] font-medium flex items-center gap-2">
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex justify-between items-center">
              <motion.h2 
                className="text-2xl font-display font-bold text-[#2D5C34]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {activeCategory === 'todos' ? 'Todos los Productos' : 
                 activeCategory === 'aguacates' ? 'Aguacates Premium' :
                 activeCategory === 'aceites' ? 'Aceites Gourmet' : 'Cuidado Personal'}
              </motion.h2>
              
              <motion.div 
                className="text-gray-600 text-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                Mostrando {sortedProducts.length} productos
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                  >
                    Contacta con nosotros
                  </Button>
                  <Button 
                    className="bg-[#2D5C34] text-white border-[#2D5C34] px-6 py-3 flex items-center gap-2"
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