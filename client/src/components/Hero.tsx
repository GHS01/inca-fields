import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative pt-24 md:pt-0 hero-parallax" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1375&q=80')",
        backgroundColor: "rgba(0,0,0,0.4)",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="container mx-auto min-h-screen flex items-center">
        <motion.div 
          className="w-full md:w-1/2 px-4 py-16 md:py-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow">
            El aguacate <span className="text-[#C6A96C] italic">perfecto</span>
          </h2>
          <p className="text-white text-lg md:text-xl font-body mb-8 leading-relaxed text-shadow">
            Descubre la experiencia única de nuestros aguacates cultivados con métodos tradicionales y estándares de calidad excepcionales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#products" 
              className="bg-[#C6A96C] text-white px-8 py-3 rounded-full font-body font-medium text-center shadow-lg hover:bg-[#2D5C34] transition-all duration-300 btn-hover"
            >
              Nuestros Productos
            </a>
            <a 
              href="#about" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-body font-medium text-center shadow-lg hover:bg-white hover:text-[#2D5C34] transition-all duration-300 btn-hover"
            >
              Conoce Nuestra Historia
            </a>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#F9F6F0" fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,122.7C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
