import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

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
    image: "https://images.unsplash.com/photo-1551460188-2f48af84affa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    badge: {
      text: "Premium",
      color: "bg-[#C6A96C]"
    },
    name: "Hass Especial",
    description: "Nuestro aguacate estrella, con el balance perfecto de cremosidad y sabor. Ideal para cualquier ocasión.",
    price: "$8.99/kg"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1573566291259-fd494a326b60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    badge: {
      text: "Orgánico",
      color: "bg-green-600"
    },
    name: "Orgánico Premium",
    description: "Cultivado sin pesticidas ni aditivos químicos, conservando todo su sabor y propiedades naturales.",
    price: "$10.99/kg"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    badge: {
      text: "Gourmet",
      color: "bg-[#BB4D00]"
    },
    name: "Pack Gourmet",
    description: "Selección especial de nuestros mejores aguacates en un empaque de lujo, perfecto para regalo.",
    price: "$24.99"
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="product-card bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden h-64">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className={`absolute top-4 right-4 ${product.badge.color} text-white text-sm font-body font-medium py-1 px-3 rounded-full`}>
          {product.badge.text}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold text-[#2D5C34] mb-2">{product.name}</h3>
        <p className="text-[#333333] font-body mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#C6A96C] font-display text-xl font-bold">{product.price}</span>
          <button className="bg-[#2D5C34] text-white px-4 py-2 rounded-full font-body hover:bg-[#C6A96C] transition-colors duration-300">
            Ver detalles
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  return (
    <section id="products" className="py-20 bg-[#F9F6F0]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-[#2D5C34] font-display text-3xl md:text-4xl font-bold mb-4">Nuestros Productos Premium</h2>
          <p className="text-[#333333] font-body text-lg max-w-3xl mx-auto">
            Cada variedad de aguacate Inca Fields es cuidadosamente seleccionada para garantizar la más alta calidad y el mejor sabor.
          </p>
          <div className="w-24 h-1 bg-[#C6A96C] mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-block bg-[#C6A96C] text-white font-body font-medium px-8 py-3 rounded-full shadow-md hover:bg-[#2D5C34] transition-all duration-300 btn-hover"
          >
            Ver Catálogo Completo
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
