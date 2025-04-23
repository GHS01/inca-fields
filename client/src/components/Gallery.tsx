import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, ZoomIn, X } from 'lucide-react';

type GalleryItem = {
  id: number;
  image: string;
  alt: string;
  category: 'platos' | 'ingredientes' | 'cultivo';
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1601039641847-7857b994d704?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Tostada de aguacate con huevo pochado y semillas de chía",
    category: 'platos'
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Ensalada con aguacate, espinacas y frutos rojos",
    category: 'platos'
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    alt: "Guacamole fresco con lima y cilantro",
    category: 'platos'
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1622205313162-be1d5710a72b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Aguacates frescos recién cosechados",
    category: 'ingredientes'
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    alt: "Sushi con aguacate y salmón premium",
    category: 'platos'
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    alt: "Smoothie de aguacate, espinacas y plátano",
    category: 'platos'
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1591870101211-e91d1e7b9a69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    alt: "Campos de aguacate en el valle andino",
    category: 'cultivo'
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1528505086635-4c69d5f10908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    alt: "Plato gourmet con aguacate y langostinos",
    category: 'platos'
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Postre de mousse de chocolate con aguacate",
    category: 'platos'
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1546634829-a022853399c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "Trabajador seleccionando los mejores aguacates",
    category: 'cultivo'
  }
];

const GalleryImage = ({ 
  item, 
  index, 
  onClick 
}: { 
  item: GalleryItem; 
  index: number;
  onClick: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className="relative h-80 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.alt} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Image overlay with zoom icon on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
            <ZoomIn className="text-white" size={32} strokeWidth={1.5} />
          </div>
        </div>
      </div>
      
      {/* Category badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs tracking-wider text-[#2D5C34] uppercase">
        {item.category}
      </div>
    </motion.div>
  );
};

// Modal component for expanded view
const GalleryModal = ({ 
  item, 
  onClose, 
  onPrev, 
  onNext 
}: { 
  item: GalleryItem | null; 
  onClose: () => void; 
  onPrev: () => void; 
  onNext: () => void;
}) => {
  if (!item) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white hover:text-[#C6A96C] z-20 transition-colors duration-300"
        aria-label="Close modal"
      >
        <X size={32} />
      </button>
      
      <button 
        onClick={onPrev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C6A96C] z-20 transition-colors duration-300 bg-black/20 p-2 rounded-full"
        aria-label="Previous image"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={onNext} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C6A96C] z-20 transition-colors duration-300 bg-black/20 p-2 rounded-full"
        aria-label="Next image"
      >
        <ChevronRight size={32} />
      </button>
      
      <div className="relative max-w-5xl w-full max-h-[80vh] overflow-hidden">
        <motion.img 
          src={item.image} 
          alt={item.alt} 
          className="w-full h-full object-contain"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute left-0 bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="text-xs uppercase tracking-wider text-[#C6A96C] mb-2">
            {item.category}
          </div>
          <h3 className="text-white font-display text-xl md:text-2xl">
            {item.alt}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  
  // Filter items based on selected category
  const filteredItems = selectedCategory === 'todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  // Handle modal navigation
  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  // Category button component
  const CategoryButton = ({ name, label }: { name: string; label: string }) => (
    <button
      onClick={() => setSelectedCategory(name)}
      className={`transition-all duration-300 px-6 py-2 text-xs uppercase tracking-wider border ${
        selectedCategory === name
          ? 'bg-[#2D5C34] text-white border-[#2D5C34]'
          : 'bg-transparent text-[#2D5C34] border-[#2D5C34]/30 hover:border-[#2D5C34]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="gallery" className="py-28 bg-white relative" ref={ref}>
      {/* Subtle pattern background */}
      <div className="absolute inset-0 bg-[#F9F6F0] opacity-20 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C6A96C' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center mb-4">
              <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
              <span className="text-[#2D5C34] text-sm tracking-[0.2em] uppercase font-light">Creaciones Culinarias</span>
              <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
            </div>
            
            <h2 className="text-[#2D5C34] font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Galería <span className="text-[#C6A96C]">Gourmet</span>
            </h2>
            
            <p className="text-gray-600 font-body text-lg max-w-2xl mx-auto mb-10">
              Descubre la versatilidad de nuestros aguacates en creaciones culinarias espectaculares
              y el proceso de cultivo que los hace únicos.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <CategoryButton name="todos" label="Todos" />
              <CategoryButton name="platos" label="Platos" />
              <CategoryButton name="ingredientes" label="Ingredientes" />
              <CategoryButton name="cultivo" label="Cultivo" />
            </div>
          </motion.div>
          
          {/* Gallery grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <GalleryImage 
                key={item.id} 
                item={item} 
                index={index} 
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
          
          {/* Modal gallery */}
          {selectedItem && (
            <GalleryModal 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="https://www.instagram.com/incafields"
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button inline-flex items-center gap-2"
            >
              <span>Síguenos en Instagram</span>
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
