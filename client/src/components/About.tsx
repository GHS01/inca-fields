import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Award, Users } from 'lucide-react';

const FeatureItem = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-[#C6A96C] rounded-full flex items-center justify-center text-white mr-4">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-[#2D5C34]">{title}</h3>
        <p className="text-[#333333] font-body">{description}</p>
      </div>
    </div>
  );
};

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-[#2D5C34] font-display text-3xl md:text-4xl font-bold mb-6">Nuestra Historia</h2>
            <p className="text-[#333333] font-body text-lg mb-6 leading-relaxed">
              Fundada en 2010, Inca Fields nació de la pasión por preservar las tradiciones agrícolas ancestrales del Perú, 
              combinándolas con las más avanzadas técnicas de cultivo sostenible.
            </p>
            <p className="text-[#333333] font-body text-lg mb-8 leading-relaxed">
              Nuestros campos están ubicados en los valles fértiles de la región andina, donde el clima y el suelo crean 
              las condiciones perfectas para cultivar aguacates de calidad excepcional.
            </p>
            
            <div className="mb-8">
              <FeatureItem 
                icon={<Leaf size={24} />}
                title="Compromiso con la Sostenibilidad"
                description="Utilizamos prácticas agrícolas que respetan el medio ambiente."
              />
              
              <FeatureItem 
                icon={<Award size={24} />}
                title="Calidad Premium"
                description="Cada aguacate pasa por un riguroso proceso de selección."
              />
              
              <FeatureItem 
                icon={<Users size={24} />}
                title="Comercio Justo"
                description="Apoyamos a las comunidades locales con prácticas comerciales éticas."
              />
            </div>
            
            <a 
              href="#" 
              className="inline-block bg-[#2D5C34] text-white font-body font-medium px-8 py-3 rounded-full shadow-md hover:bg-[#C6A96C] transition-all duration-300 btn-hover"
            >
              Nuestra Filosofía
            </a>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-xl overflow-hidden h-64 shadow-lg transform -rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1591870101211-e91d1e7b9a69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Campos de aguacate" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-64 mt-12 shadow-lg transform rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1546634829-a022853399c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Agricultor en campos" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-64 shadow-lg transform rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1550431241-a235f5d394cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Proceso de selección" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-64 mt-12 shadow-lg transform -rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1532509854226-a2d9d8e66f29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Empaque premium" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
