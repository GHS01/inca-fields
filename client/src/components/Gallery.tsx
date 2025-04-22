import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

type GalleryItem = {
  id: number;
  image: string;
  alt: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1601039641847-7857b994d704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Tostada de aguacate"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Ensalada con aguacate"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    alt: "Guacamole fresco"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Aguacates frescos"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    alt: "Sushi con aguacate"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    alt: "Smoothie de aguacate"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Postre de aguacate"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1528505086635-4c69d5f10908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    alt: "Plato gourmet con aguacate"
  }
];

const GalleryImage = ({ item, index }: { item: GalleryItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="gallery-item rounded-xl overflow-hidden shadow-md transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <img src={item.image} alt={item.alt} className="w-full h-64 object-cover" />
    </motion.div>
  );
};

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="gallery" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-[#2D5C34] font-display text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Galería Gourmet
          </motion.h2>
          <motion.p
            className="text-[#333333] font-body text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Descubre la versatilidad de nuestros aguacates en creaciones culinarias espectaculares.
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-[#C6A96C] mx-auto mt-6"
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: 96 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <GalleryImage key={item.id} item={item} index={index} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <motion.a
            href="#"
            className="inline-block bg-[#2D5C34] text-white font-body font-medium px-8 py-3 rounded-full shadow-md hover:bg-[#C6A96C] transition-all duration-300 btn-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Ver Más Inspiración
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
