import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

type Testimonial = {
  id: number;
  rating: number;
  text: string;
  author: {
    name: string;
    title: string;
    image: string;
  };
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    text: "Como chef, la calidad de los ingredientes es fundamental. Los aguacates Inca Fields son simplemente los mejores que he probado. La cremosidad y el sabor son incomparables.",
    author: {
      name: "Chef Martínez",
      title: "Restaurante Estrella, Madrid",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  },
  {
    id: 2,
    rating: 5,
    text: "Desde que descubrimos los aguacates Inca Fields, no queremos otra marca. La diferencia en sabor y textura es notable, y nuestros clientes lo aprecian.",
    author: {
      name: "Carlos Ramos",
      title: "Supermercados Premium",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  },
  {
    id: 3,
    rating: 5,
    text: "Como nutricionista, siempre recomiendo aguacates de calidad a mis pacientes. Los de Inca Fields son excepcionales, con un perfil nutricional superior y un sabor delicioso.",
    author: {
      name: "Dra. Sofia López",
      title: "Nutricionista Deportiva",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
    }
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-xl shadow-lg p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center mb-4">
        <div className="text-[#C6A96C]">
          {Array(testimonial.rating).fill(0).map((_, i) => (
            <Star key={i} className="inline-block fill-[#C6A96C]" size={16} />
          ))}
        </div>
      </div>
      <p className="text-[#333333] font-body italic mb-6">{testimonial.text}</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={testimonial.author.image} alt={testimonial.author.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-display text-lg font-bold text-[#2D5C34]">{testimonial.author.name}</h4>
          <p className="text-sm text-[#333333]">{testimonial.author.title}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 bg-[#F9F6F0]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-[#2D5C34] font-display text-3xl md:text-4xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-[#333333] font-body text-lg max-w-3xl mx-auto">
            Restaurantes, chefs y hogares alrededor del mundo confían en la calidad de los aguacates Inca Fields.
          </p>
          <div className="w-24 h-1 bg-[#C6A96C] mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
