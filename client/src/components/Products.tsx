import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

type Product = {
  id: number;
  image: string;
  badge: {
    text: string;
    color: string;
  };
  name: string;
  description: string;
  price: string;
};

const products: Product[] = [
  {
    id: 1,
    image: "/images/Aguacate fuerte Premium.jpeg",
    badge: {
      text: "Premium",
      color: "bg-[#C6A96C]"
    },
    name: "Aguacate fuerte Premium",
    description: "Nuestro aguacate estrella, con el balance perfecto de cremosidad y sabor. Ideal para cualquier ocasión.",
    price: "S/8.99/kg"
  },
  {
    id: 2,
    image: "/images/Aguacate Organico.jpeg",
    badge: {
      text: "Orgánico",
      color: "bg-green-600"
    },
    name: "Aguacate Orgánico",
    description: "Cultivado sin pesticidas ni aditivos químicos, conservando todo su sabor y propiedades naturales.",
    price: "S/10.99/kg"
  },
  {
    id: 3,
    image: "/images/Aguacate Hass Premium.jpeg",
    badge: {
      text: "Premium",
      color: "bg-[#C6A96C]"
    },
    name: "Aguacate Hass Premium",
    description: "Selección especial de nuestros mejores aguacates en un empaque de lujo, perfecto para regalo.",
    price: "S/24.99"
  }
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Función para manejar el clic en el botón de compra
  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el clic se propague

    // Redirigir según el tipo de aguacate
    if (product.name === "Aguacate fuerte Premium") {
      window.open("https://wa.link/wdn6az", "_blank");
    } else if (product.name === "Aguacate Hass Premium") {
      window.open("https://wa.link/77jjyl", "_blank");
    } else if (product.name === "Aguacate Orgánico") {
      window.open("https://wa.link/z62ogj", "_blank");
    } else {
      // Para otros productos, usar el enlace general
      window.open("https://wa.link/reqscn", "_blank");
    }
  };

  return (
    <motion.div
      ref={ref}
      className="product-card relative bg-white overflow-hidden transition-all duration-500 group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Golden accent line */}
      <div className="absolute top-0 left-0 w-0 h-1 bg-[#C6A96C] z-10 group-hover:w-full transition-all duration-500"></div>

      <div className="relative overflow-hidden h-72">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className={`absolute top-4 right-4 ${product.badge.color} text-white text-xs uppercase tracking-wider py-1 px-3`}>
          {product.badge.text}
        </div>
      </div>

      <div className="p-8 border-b border-l border-r border-gray-100">
        <h3 className="font-display text-2xl font-bold text-[#2D5C34] mb-3">{product.name}</h3>
        <div className="w-10 h-[1px] bg-[#C6A96C] mb-4"></div>
        <p className="text-gray-600 font-body mb-6 text-sm">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-[#C6A96C] font-display text-xl font-bold">{product.price}</span>
          <button
            onClick={handleBuyClick}
            className="bg-transparent border border-[#2D5C34] text-[#2D5C34] group-hover:bg-[#2D5C34] group-hover:text-white px-4 py-2 flex items-center gap-2 transition-all duration-300 text-sm uppercase tracking-wider"
          >
            <ShoppingCart size={16} />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section id="products" className="py-24 bg-[#F9F6F0]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto" ref={titleRef}>
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
              <span className="text-[#2D5C34] text-sm tracking-[0.2em] uppercase font-light">Exclusivo</span>
              <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
            </div>

            <h2 className="text-[#2D5C34] font-display text-4xl md:text-5xl font-bold mb-6 text-center">
              Nuestra Selección <span className="text-[#C6A96C]">Premium</span>
            </h2>

            <p className="text-gray-600 font-body text-lg max-w-2xl mx-auto text-center mb-8">
              Cada variedad de aguacate Inca Fields es cuidadosamente seleccionada para garantizar
              la más alta calidad y el mejor sabor en cada bocado.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/tienda"
            className="luxury-button-gold inline-flex items-center gap-2 text-xs sm:text-sm md:text-base px-4 py-2 sm:px-6 sm:py-3 max-w-full"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight size={14} className="sm:w-4 sm:h-4 w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
