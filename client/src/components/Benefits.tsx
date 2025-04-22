import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Sprout, Apple, Award } from 'lucide-react';

type BenefitItem = {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const benefits: BenefitItem[] = [
  {
    id: 1,
    icon: <Heart size={24} />,
    title: "Salud Cardiovascular",
    description: "Ricos en grasas monoinsaturadas que ayudan a mantener un corazón saludable."
  },
  {
    id: 2,
    icon: <Sprout size={24} />,
    title: "Cultivo Orgánico",
    description: "Cultivados sin pesticidas ni químicos dañinos, respetando el medio ambiente."
  },
  {
    id: 3,
    icon: <Apple size={24} />,
    title: "Sabor Superior",
    description: "Un sabor distintivo y cremoso que eleva cualquier plato a un nivel gourmet."
  },
  {
    id: 4,
    icon: <Award size={24} />,
    title: "Certificación Premium",
    description: "Cada aguacate cumple con los más altos estándares internacionales de calidad."
  }
];

const BenefitCard = ({ benefit, index }: { benefit: BenefitItem; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="w-16 h-16 bg-[#C6A96C] rounded-full flex items-center justify-center text-white mb-6 mx-auto">
        {benefit.icon}
      </div>
      <h3 className="font-display text-xl font-bold text-center mb-4">{benefit.title}</h3>
      <p className="font-body text-center">{benefit.description}</p>
    </motion.div>
  );
};

const Benefits = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefits" className="py-20 bg-[#2D5C34] text-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Beneficios de Nuestros Aguacates</h2>
          <p className="font-body text-lg max-w-3xl mx-auto">
            Descubre por qué los aguacates Inca Fields son reconocidos como los mejores del mercado.
          </p>
          <div className="w-24 h-1 bg-[#C6A96C] mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 bg-white bg-opacity-10 rounded-xl p-8 md:p-12 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">Descubre el Poder Nutricional</h3>
              <p className="font-body text-lg mb-6">
                Nuestros aguacates contienen más de 20 vitaminas y minerales esenciales, incluyendo potasio, 
                vitaminas E, C y B, además de fibra y ácidos grasos saludables.
              </p>
              <a 
                href="#" 
                className="inline-block bg-[#C6A96C] text-white font-body font-medium px-8 py-3 rounded-full shadow-md hover:bg-white hover:text-[#2D5C34] transition-all duration-300 btn-hover"
              >
                Guía Nutricional
              </a>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2535&q=80" 
                alt="Aguacate con beneficios" 
                className="rounded-xl shadow-lg max-h-64 object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
