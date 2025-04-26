import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Heart, Sprout, Apple, Award, ArrowRight, Activity, Brain, Info, X } from 'lucide-react';

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
    color: "#C6A96C"
  },
  {
    id: 2,
    icon: <Sprout size={24} />,
    title: "Cultivo Orgánico",
    description: "Cultivados sin pesticidas ni químicos dañinos, respetando el medio ambiente y preservando los ecosistemas.",
    color: "#C6A96C"
  },
  {
    id: 3,
    icon: <Brain size={24} />,
    title: "Salud Cerebral",
    description: "Contienen altos niveles de luteína, un nutriente fundamental para mantener la salud cognitiva.",
    color: "#C6A96C"
  },
  {
    id: 4,
    icon: <Activity size={24} />,
    title: "Energía Natural",
    description: "Proporcionan energía sostenible gracias a su combinación única de grasas y nutrientes esenciales.",
    color: "#C6A96C"
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
    color: "#C6A96C"
  }
];

// Panel de información nutricional que reemplaza la imagen
const NutrientPanel = () => {
  const [activeNutrient, setActiveNutrient] = useState("acido-folico");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const nutrientData = {
    "acido-folico": {
      title: "Rico en ácido fólico",
      description: "El ácido fólico (vitamina B9) es esencial para el desarrollo celular y la formación de ADN. En el aguacate, contribuye a la salud cardiovascular, desarrollo fetal y formación de glóbulos rojos.",
      percentage: "92%",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    "potasio": {
      title: "Alto contenido de potasio",
      description: "El potasio en los aguacates ayuda a regular la presión arterial, la función muscular y nerviosa. Un aguacate contiene más potasio que un plátano, lo que favorece al equilibrio electrolítico del cuerpo.",
      percentage: "95%",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    "antioxidantes": {
      title: "Antioxidantes naturales",
      description: "Los antioxidantes del aguacate, como la luteína y la zeaxantina, protegen contra daños celulares, reducen la inflamación y mejoran la salud ocular. Combaten el envejecimiento prematuro.",
      percentage: "85%",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    "omega-3": {
      title: "Omega-3 esenciales",
      description: "Los ácidos grasos Omega-3 presentes en el aguacate son fundamentales para la salud cerebral, cardiovascular y reducción de inflamación. Contribuyen a mantener equilibrados los niveles de colesterol.",
      percentage: "89%",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69397 19.0554 3.4172C18.388 3.14044 17.6726 2.99805 16.95 2.99805C16.2274 2.99805 15.512 3.14044 14.8446 3.4172C14.1772 3.69397 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3508 11.8792 21.756 11.2728 22.0328 10.6054C22.3095 9.93801 22.4519 9.22261 22.4519 8.5C22.4519 7.77739 22.3095 7.06199 22.0328 6.39462C21.756 5.72724 21.3508 5.12084 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    "indice-glucemico": {
      title: "Bajo índice glucémico",
      description: "Los aguacates tienen un índice glucémico muy bajo, lo que significa que no elevan significativamente el azúcar en sangre. Son ideales para personas con diabetes o en dietas de control de azúcar.",
      percentage: "96%",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 4H3M21 12H3M21 20H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    "vitaminas": {
      title: "Vitaminas A, D, E y K",
      description: "Estas vitaminas liposolubles presentes en el aguacate son esenciales para la salud ósea, ocular, inmunológica y la coagulación sanguínea. Además, son poderosos antioxidantes que protegen tus células.",
      percentage: "90%",
      iconSvg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 4.93L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  };

  const active = nutrientData[activeNutrient as keyof typeof nutrientData];

  return (
    <div ref={ref} className="relative bg-[#1E3323] rounded-lg overflow-hidden shadow-2xl border border-[#C6A96C]/20">
      {/* Decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#C6A96C]/5"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#C6A96C]/5"></div>
      
      <div className="relative p-8 z-10">
        {/* Selector de nutrientes */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.keys(nutrientData).map((key) => {
            const nutrient = nutrientData[key as keyof typeof nutrientData];
            const isActive = activeNutrient === key;
            
            return (
              <button
                key={key}
                onClick={() => setActiveNutrient(key)}
                className={`py-2 px-3 text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#C6A96C] text-white border-[#C6A96C]' 
                    : 'bg-transparent text-white border border-white/30 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="mr-1 text-xs">✓</span>
                )}
                <span>{nutrient.title}</span>
              </button>
            );
          })}
        </div>
        
        {/* Contenido del nutriente seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNutrient}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-8"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-display text-white font-bold mb-3 flex items-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-[#C6A96C]/10 text-[#C6A96C] flex items-center justify-center mr-3"
                >
                  {active.iconSvg}
                </motion.span>
                {active.title}
              </h3>
              
              <p className="text-white/80 leading-relaxed mb-6">
                {active.description}
              </p>
              
              {/* Barra de comparación */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Superioridad nutricional</span>
                  <span className="text-[#C6A96C] font-medium">{active.percentage}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#C6A96C] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: active.percentage }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Estándar</span>
                  <span>Inca Fields Premium</span>
                </div>
              </div>
              
              {/* Cita */}
              <div className="relative p-4 border-l-2 border-[#C6A96C]/50 bg-white/5 italic text-white/70 text-sm">
                "Los aguacates Inca Fields contienen niveles excepcionales de {active.title.toLowerCase()}, gracias a nuestras prácticas de cultivo premium y las condiciones únicas de los valles peruanos."
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const BenefitCard = ({ benefit, index }: { benefit: BenefitItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo principal */}
      <div className="absolute inset-0 bg-[#1E3323] border border-[#C6A96C]/20 transition-all duration-500 group-hover:border-[#C6A96C]/50"></div>
      
      {/* Borde decorativo */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-0 left-0 w-[20%] h-[1px] bg-[#C6A96C]"></div>
        <div className="absolute top-0 left-0 w-[1px] h-[20%] bg-[#C6A96C]"></div>
        <div className="absolute top-0 right-0 w-[20%] h-[1px] bg-[#C6A96C]"></div>
        <div className="absolute top-0 right-0 w-[1px] h-[20%] bg-[#C6A96C]"></div>
        <div className="absolute bottom-0 left-0 w-[20%] h-[1px] bg-[#C6A96C]"></div>
        <div className="absolute bottom-0 left-0 w-[1px] h-[20%] bg-[#C6A96C]"></div>
        <div className="absolute bottom-0 right-0 w-[20%] h-[1px] bg-[#C6A96C]"></div>
        <div className="absolute bottom-0 right-0 w-[1px] h-[20%] bg-[#C6A96C]"></div>
      </div>
      
      {/* Reflejo superior */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Contenido */}
      <div className="relative p-8 z-10">
        <div className="flex items-center mb-6">
          <motion.div
            className="w-12 h-12 mr-4 relative"
            animate={{
              y: isHovered ? [0, -3, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              repeatType: "mirror"
            }}
          >
            {/* Círculo de fondo */}
            <div className="absolute inset-0 rounded-full bg-[#C6A96C]/10"></div>
            
            {/* Icono */}
            <div className="absolute inset-0 flex items-center justify-center text-[#C6A96C]">
              {benefit.icon}
            </div>
            
            {/* Anillo dorado */}
            <motion.div 
              className="absolute inset-0 border border-[#C6A96C]/40 rounded-full"
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? [0.4, 0.8, 0.4] : 0.4
              }}
              transition={{
                duration: 3,
                repeat: isHovered ? Infinity : 0,
                repeatType: "mirror"
              }}
            ></motion.div>
          </motion.div>
          
          <h3 className="font-display text-xl font-bold text-white tracking-wide">
            {benefit.title}
          </h3>
        </div>
        
        <p className="font-body text-white/80 leading-relaxed pl-16">
          {benefit.description}
        </p>
        
        {/* Botón "Ver más" minimalista */}
        <div className="mt-6 pl-16 overflow-hidden h-7">
          <motion.div
            className="flex items-center text-[#C6A96C] text-sm font-medium cursor-pointer group-hover:translate-y-0 translate-y-7 transition-transform duration-500"
            animate={{
              x: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="mr-2">Descubrir más</span>
            <ArrowRight size={14} />
          </motion.div>
        </div>
      </div>
      
      {/* Firma de esquina */}
      <div className="absolute bottom-3 right-3 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
        <motion.div 
          className="w-full h-full"
          style={{ 
            background: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMkMxNiAyIDkgMiA5IDkiIHN0cm9rZT0iI0M2QTk2QyIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=)',
            backgroundSize: 'contain'
          }}
          animate={{
            rotate: isHovered ? 90 : 0
          }}
          transition={{ duration: 0.7 }}
        />
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
              
              <motion.a 
                href="#" 
                className="inline-flex items-center gap-2 luxury-button bg-[#C6A96C] text-white mb-12 text-xs sm:text-sm md:text-base px-4 py-2 sm:px-6 sm:py-3 max-w-full"
                whileHover={{ x: 5 }}
              >
                <span>Descarga Nuestra Guía Nutricional</span>
                <ArrowRight size={14} className="sm:w-4 sm:h-4 w-3 h-3" />
              </motion.a>
            </div>
            
            <div className="md:col-span-2 relative">
              <NutrientPanel />
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
