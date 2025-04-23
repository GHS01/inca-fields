import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Sprout, Apple, Award, ArrowRight, Activity, Brain } from 'lucide-react';

type BenefitItem = {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
};

const benefits: BenefitItem[] = [
  {
    id: 1,
    icon: <Heart size={24} />,
    title: "Salud Cardiovascular",
    description: "Ricos en grasas monoinsaturadas que ayudan a mantener un corazón saludable y reducen el colesterol.",
    color: "#A7425C"
  },
  {
    id: 2,
    icon: <Sprout size={24} />,
    title: "Cultivo Orgánico",
    description: "Cultivados sin pesticidas ni químicos dañinos, respetando el medio ambiente y preservando los ecosistemas.",
    color: "#4D9E5A"
  },
  {
    id: 3,
    icon: <Brain size={24} />,
    title: "Salud Cerebral",
    description: "Contienen altos niveles de luteína, un nutriente fundamental para mantener la salud cognitiva.",
    color: "#5C88C5"
  },
  {
    id: 4,
    icon: <Activity size={24} />,
    title: "Energía Natural",
    description: "Proporcionan energía sostenible gracias a su combinación única de grasas y nutrientes esenciales.",
    color: "#DC8239"
  },
  {
    id: 5,
    icon: <Apple size={24} />,
    title: "Sabor Superior",
    description: "Un sabor distintivo y cremoso que eleva cualquier plato a un nivel gourmet inigualable.",
    color: "#C6A96C"
  },
  {
    id: 6,
    icon: <Award size={24} />,
    title: "Certificación Premium",
    description: "Cada aguacate cumple con los más altos estándares internacionales de calidad y excelencia.",
    color: "#2D5C34"
  }
];

const BenefitCard = ({ benefit, index }: { benefit: BenefitItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Color accent at top */}
      <div 
        className="absolute top-0 left-0 w-full h-1 opacity-70 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
        style={{ backgroundColor: benefit.color }}
      ></div>
      
      <div className="p-8">
        <div 
          className="w-16 h-16 rounded-sm flex items-center justify-center text-white mb-6 rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-lg"
          style={{ backgroundColor: benefit.color }}
        >
          {benefit.icon}
        </div>
        
        <h3 className="font-display text-xl font-bold mb-4 text-white group-hover:text-[#C6A96C] transition-colors duration-300">
          {benefit.title}
        </h3>
        
        <p className="font-body text-white/80 leading-relaxed">
          {benefit.description}
        </p>
      </div>
      
      {/* Subtle corner accent */}
      <div className="absolute bottom-0 right-0 w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <div className="absolute top-0 left-0 w-full h-full border-b border-r border-white/30 transform rotate-45 origin-bottom-right"></div>
      </div>
    </motion.div>
  );
};

const Benefits = () => {
  const ref = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section id="benefits" className="py-28 bg-[#2D5C34] text-white relative" ref={ref}>
      {/* Diagonal division shape at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-16">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" className="absolute top-0 w-full h-20">
          <path 
            fill="#FFF" 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".15"
          ></path>
          <path 
            fill="#FFF" 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".1"
          ></path>
        </svg>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559589311-5f86184cf830?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-fixed opacity-[0.03] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto" ref={titleRef}>
          <motion.div 
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
              <span className="text-[#C6A96C] text-sm tracking-[0.2em] uppercase font-light">Beneficios Saludables</span>
              <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Por qué elegir <span className="text-[#C6A96C]">Inca Fields</span>
            </h2>
            
            <p className="font-body text-lg text-white/80 max-w-2xl mx-auto">
              Los aguacates Inca Fields son reconocidos como los mejores del mercado por su 
              calidad excepcional y sus múltiples beneficios para tu salud y bienestar.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-24 bg-white bg-opacity-[0.03] border border-white/10 backdrop-blur-sm p-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#C6A96C] opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#C6A96C] opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center relative z-10">
            <div className="md:col-span-3">
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Descubre el Poder <span className="text-[#C6A96C]">Nutricional</span>
              </h3>
              
              <p className="font-body text-white/90 text-lg mb-8 leading-relaxed">
                Nuestros aguacates contienen más de 20 vitaminas y minerales esenciales, como potasio, 
                vitaminas E, C y B, además de fibra y ácidos grasos saludables que contribuyen 
                a fortalecer tu sistema inmunológico y mejorar tu salud general.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Rico en ácido fólico",
                  "Alto contenido de potasio",
                  "Antioxidantes naturales",
                  "Omega-3 esenciales",
                  "Bajo índice glucémico",
                  "Vitaminas A, D, E y K"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-[#C6A96C] mr-3"></div>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              
              <motion.a 
                href="#" 
                className="inline-flex items-center gap-2 luxury-button bg-[#C6A96C] text-white"
                whileHover={{ x: 5 }}
              >
                <span>Descarga Nuestra Guía Nutricional</span>
                <ArrowRight size={16} />
              </motion.a>
            </div>
            
            <div className="md:col-span-2 relative">
              <div className="relative z-20 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2535&q=80" 
                  alt="Aguacate con beneficios" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 border-2 border-[#C6A96C]/30 transform rotate-3 z-10"></div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Diagonal division shape at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-16">
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" className="absolute bottom-0 w-full h-20 rotate-180">
          <path 
            fill="#FFF" 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".15"
          ></path>
          <path 
            fill="#FFF" 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".1"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Benefits;
