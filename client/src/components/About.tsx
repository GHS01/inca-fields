import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Award, Users, ArrowRight } from 'lucide-react';

const FeatureItem = ({ 
  icon, 
  title, 
  description,
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div 
      ref={ref}
      className="relative mb-8 pl-8 border-l border-[#C6A96C]/30 hover:border-[#C6A96C] transition-colors duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="absolute left-[-18px] top-0 w-9 h-9 bg-white border border-[#C6A96C] flex items-center justify-center text-[#2D5C34]">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-[#2D5C34] mb-2">{title}</h3>
      <p className="text-gray-600 font-body leading-relaxed">{description}</p>
    </motion.div>
  );
};

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden" ref={ref}>
      {/* Golden accent diagonal line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A96C] to-transparent"></div>
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-[#C6A96C] via-transparent to-transparent"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 border border-[#2D5C34] rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-60 h-60 border border-[#C6A96C] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#2D5C34] rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center mb-6">
                <div className="h-[1px] w-8 bg-[#C6A96C] mr-3"></div>
                <span className="text-[#2D5C34] text-sm tracking-[0.2em] uppercase font-light">Tradición y Calidad</span>
              </div>
              
              <h2 className="text-[#2D5C34] font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Nuestra <span className="text-[#C6A96C]">Historia</span>
              </h2>
              
              <motion.p 
                className="text-gray-700 font-body text-lg mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Fundada en 2010, Inca Fields nació de la pasión por preservar las tradiciones agrícolas ancestrales del Perú, 
                combinándolas con las más avanzadas técnicas de cultivo sostenible.
              </motion.p>
              
              <motion.p 
                className="text-gray-700 font-body text-lg mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Nuestros campos están ubicados en los valles fértiles de la región andina, donde el clima excepcional y el suelo mineral
                crean las condiciones perfectas para cultivar aguacates de clase mundial con un sabor y textura incomparables.
              </motion.p>
              
              <div className="mb-10">
                <FeatureItem 
                  icon={<Leaf size={18} />}
                  title="Compromiso con la Sostenibilidad"
                  description="Utilizamos prácticas agrícolas que respetan el medio ambiente y garantizan la biodiversidad de nuestros campos."
                  delay={0.4}
                />
                
                <FeatureItem 
                  icon={<Award size={18} />}
                  title="Calidad Premium Certificada"
                  description="Cada aguacate pasa por un riguroso proceso de selección para garantizar la máxima calidad en su mesa."
                  delay={0.5}
                />
                
                <FeatureItem 
                  icon={<Users size={18} />}
                  title="Comercio Justo y Ético"
                  description="Apoyamos a las comunidades locales con prácticas comerciales éticas que mejoran la vida de nuestros productores."
                  delay={0.6}
                />
              </div>
              
              <motion.a 
                href="#" 
                className="inline-flex items-center gap-2 luxury-button bg-gold force-dark-text"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <span>Descubrir Nuestra Filosofía</span>
                <ArrowRight size={16} />
              </motion.a>
            </motion.div>
            
            <div className="order-1 lg:order-2 relative h-[550px]">
              <motion.div 
                className="absolute top-0 left-0 w-3/4 h-3/5 z-10"
                initial={{ opacity: 0, scale: 0.9, x: 30 }}
                animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: 30 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="w-full h-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1591870101211-e91d1e7b9a69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Campos de aguacate" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 border border-[#C6A96C]/20 -m-3"></div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-0 right-0 w-3/4 h-3/5 z-0"
                initial={{ opacity: 0, scale: 0.9, x: -30 }}
                animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.9, x: -30 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="w-full h-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1546634829-a022853399c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Agricultor en campos" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 border border-[#2D5C34]/20 -m-3"></div>
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white p-4 shadow-xl z-20 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -5 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-center">
                  <div className="text-[#C6A96C] font-display text-5xl font-bold">13</div>
                  <div className="text-[#2D5C34] uppercase text-sm tracking-wider">Años de Tradición</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
