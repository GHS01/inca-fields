import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed w-full bg-[#F9F6F0] bg-opacity-95 z-50 transition-all duration-300 shadow-md",
      scrolled ? "py-2" : "py-4"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-[#2D5C34] font-display text-2xl md:text-3xl font-bold">
            Inca Fields<span className="text-[#C6A96C] italic ml-1 text-sm md:text-base">Premium</span>
          </h1>
        </div>
        
        {/* Mobile menu button */}
        <div className="block lg:hidden">
          <button 
            onClick={toggleMobileMenu} 
            className="text-[#2D5C34] focus:outline-none"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#home" className="text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300">Inicio</a>
          <a href="#products" className="text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300">Productos</a>
          <a href="#about" className="text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300">Nosotros</a>
          <a href="#benefits" className="text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300">Beneficios</a>
          <a href="#gallery" className="text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300">Galería</a>
          <a href="#contact" className="bg-[#C6A96C] text-white px-5 py-2 rounded-full font-body font-medium shadow-md hover:bg-[#2D5C34] transition-all duration-300 btn-hover">Contacto</a>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn("lg:hidden bg-[#F9F6F0]", mobileMenuOpen ? "block" : "hidden")}>
        <div className="container mx-auto px-4 pt-2 pb-4 space-y-3">
          <a href="#home" onClick={closeMobileMenu} className="block text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300 py-2">Inicio</a>
          <a href="#products" onClick={closeMobileMenu} className="block text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300 py-2">Productos</a>
          <a href="#about" onClick={closeMobileMenu} className="block text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300 py-2">Nosotros</a>
          <a href="#benefits" onClick={closeMobileMenu} className="block text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300 py-2">Beneficios</a>
          <a href="#gallery" onClick={closeMobileMenu} className="block text-[#2D5C34] hover:text-[#C6A96C] font-body font-medium transition-colors duration-300 py-2">Galería</a>
          <a href="#contact" onClick={closeMobileMenu} className="block bg-[#C6A96C] text-white px-5 py-2 rounded-full font-body font-medium shadow-md hover:bg-[#2D5C34] transition-all duration-300 btn-hover text-center mt-4">Contacto</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
