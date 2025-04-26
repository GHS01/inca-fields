import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Actualizado a formato WebP
  const heroImages = [
    '/images/image-hero-1.webp',
    '/images/image-hero-2.webp',
    '/images/image-hero-3.webp',
    '/images/image-hero-4.webp',
  ];

  // Carrusel simple con cambio automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Cambiar imagen cada 5 segundos

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  return (
    <section
      id="home"
      className="relative pt-24 md:pt-0 hero-parallax overflow-hidden"
    >
      {/* Carrusel de imágenes */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          {heroImages.map((image, index) => (
            index === currentImageIndex && (
              <motion.div
                key={image}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${image}')`,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    backgroundBlendMode: "overlay",
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                  }}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Golden accent line at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C6A96C] via-[#F0D898] to-[#C6A96C] z-20"></div>

      {/* Elegant overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10"></div>

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
            <span className="text-[#C6A96C] text-sm tracking-[0.3em] uppercase font-light text-shadow">Premium Collection</span>
          </motion.div>

          {/* Main headline */}
          <h2 className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow-lg">
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
            <p className="text-white/90 text-lg md:text-xl font-body leading-relaxed max-w-lg text-shadow">
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

      {/* Indicadores de diapositivas */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 hidden lg:flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index
                ? 'bg-[#C6A96C] w-6'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
