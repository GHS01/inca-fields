import { motion } from 'framer-motion';
import { Link } from 'wouter';

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative pt-24 md:pt-0 hero-parallax" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1375&q=80')",
        backgroundColor: "rgba(0,0,0,0.2)",
        backgroundBlendMode: "overlay",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      {/* Golden accent line at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C6A96C] via-[#F0D898] to-[#C6A96C] z-20"></div>
      
      {/* Elegant overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      
      <div className="container mx-auto min-h-screen flex items-center relative z-10">
        <motion.div 
          className="w-full md:w-1/2 px-4 py-16 md:py-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top label with gold accent */}
          <motion.div
            className="flex items-center mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-10 h-[1px] bg-[#C6A96C] mr-4"></div>
            <span className="text-[#C6A96C] text-sm tracking-[0.3em] uppercase font-light">Premium Collection</span>
          </motion.div>
          
          {/* Main headline */}
          <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            El aguacate <span className="text-[#C6A96C]">perfecto</span> <br/>
            <span className="text-3xl md:text-4xl lg:text-5xl font-normal">para <span className="italic">paladares exigentes</span></span>
          </h2>
          
          {/* Description with slightly transparent background for better readability */}
          <motion.div
            className="mb-10 pl-4 border-l-2 border-[#C6A96C]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-white/90 text-lg md:text-xl font-body leading-relaxed max-w-lg">
              Descubre la experiencia única de nuestros aguacates cultivados con métodos tradicionales y estándares de calidad excepcionales.
            </p>
          </motion.div>
          
          {/* Buttons container */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a 
              href="#products" 
              className="luxury-button bg-[#C6A96C] text-white border border-[#C6A96C] inline-block font-body text-center uppercase tracking-wider text-sm"
            >
              Nuestros Productos
            </a>
            <Link
              href="/tienda"
              className="luxury-button border-white text-white inline-block font-body text-center uppercase tracking-wider text-sm"
            >
              Tienda
            </Link>
          </motion.div>
          
          {/* Bottom tag */}
          <motion.div 
            className="mt-16 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="h-[1px] w-12 bg-[#C6A96C] mr-4"></div>
            <p className="text-white/80 text-sm uppercase tracking-[0.2em]">Calidad Excepcional</p>
          </motion.div>
        </motion.div>
        
        {/* Subtle golden accent on the right side */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 h-60 w-1 bg-gradient-to-b from-transparent via-[#C6A96C] to-transparent hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1.2 }}
        ></motion.div>
      </div>
      
      {/* Wavy divider at bottom */}
      <div className="absolute bottom-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#F9F6F0" fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,122.7C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
