import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';

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
      "fixed w-full z-50 transition-all duration-500",
      scrolled 
        ? "py-2 md:py-3 bg-[#F9F6F0] bg-opacity-95 shadow-lg" 
        : "py-4 md:py-6 bg-transparent"
    )}>
      {/* Top golden line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A96C] to-transparent"></div>
      
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className={cn(
            "font-display font-bold tracking-tight transition-all duration-500 whitespace-nowrap",
            scrolled ? "text-[#2D5C34] text-xl md:text-2xl" : "text-white text-xl md:text-2xl lg:text-3xl"
          )}>
            Inca Fields
            <span className="text-[#C6A96C] italic ml-1 text-sm md:text-base">Premium</span>
          </h1>
        </Link>
        
        {/* Mobile menu button */}
        <div className="block lg:hidden">
          <button 
            onClick={toggleMobileMenu} 
            className={cn(
              "focus:outline-none transition-colors duration-300 p-1",
              scrolled ? "text-[#2D5C34]" : "text-white"
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={22} className="transition-all duration-300" />
            ) : (
              <Menu size={22} className="transition-all duration-300" />
            )}
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/" 
            className={cn(
              "font-body transition-all duration-300 text-sm uppercase tracking-widest",
              scrolled 
                ? "text-[#2D5C34] hover:text-[#C6A96C]" 
                : "text-white/80 hover:text-white"
            )}
          >
            Inicio
          </Link>
          <Link 
            href="/productos" 
            className={cn(
              "font-body transition-all duration-300 text-sm uppercase tracking-widest",
              scrolled 
                ? "text-[#2D5C34] hover:text-[#C6A96C]" 
                : "text-white/80 hover:text-white"
            )}
          >
            Productos
          </Link>
          <Link 
            href="/nosotros" 
            className={cn(
              "font-body transition-all duration-300 text-sm uppercase tracking-widest",
              scrolled 
                ? "text-[#2D5C34] hover:text-[#C6A96C]" 
                : "text-white/80 hover:text-white"
            )}
          >
            Nosotros
          </Link>
          <Link 
            href="/beneficios" 
            className={cn(
              "font-body transition-all duration-300 text-sm uppercase tracking-widest",
              scrolled 
                ? "text-[#2D5C34] hover:text-[#C6A96C]" 
                : "text-white/80 hover:text-white"
            )}
          >
            Beneficios
          </Link>
          <Link 
            href="/galeria" 
            className={cn(
              "font-body transition-all duration-300 text-sm uppercase tracking-widest",
              scrolled 
                ? "text-[#2D5C34] hover:text-[#C6A96C]" 
                : "text-white/80 hover:text-white"
            )}
          >
            Galería
          </Link>
          <Link
            href="/tienda"
            className={cn(
              "font-body transition-all duration-300 text-sm uppercase tracking-widest",
              scrolled 
                ? "text-[#2D5C34] hover:text-[#C6A96C]" 
                : "text-white/80 hover:text-white"
            )}
          >
            Tienda
          </Link>
          <Link 
            href="/contacto" 
            className={cn(
              "border px-6 py-2 font-body text-sm uppercase tracking-wider transition-all duration-300",
              scrolled
                ? "border-[#C6A96C] text-[#2D5C34] hover:bg-[#C6A96C] hover:text-white" 
                : "border-white/50 text-white hover:bg-white/10"
            )}
          >
            Contacto
          </Link>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={cn(
          "lg:hidden transition-all duration-500 overflow-hidden fixed left-0 right-0 z-50",
          mobileMenuOpen 
            ? "max-h-[500px] opacity-100 border-t border-[#C6A96C]/20" 
            : "max-h-0 opacity-0"
        )}
        style={{
          backgroundColor: scrolled ? "#F9F6F0" : "rgba(0,0,0,0.9)",
          top: scrolled ? "47px" : "63px"
        }}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          <Link 
            href="/" 
            onClick={closeMobileMenu} 
            className={cn(
              "block font-body text-sm uppercase tracking-widest transition-colors duration-300 py-2",
              scrolled ? "text-[#2D5C34] hover:text-[#C6A96C]" : "text-white/80 hover:text-white"
            )}
          >
            Inicio
          </Link>
          <Link 
            href="/productos" 
            onClick={closeMobileMenu} 
            className={cn(
              "block font-body text-sm uppercase tracking-widest transition-colors duration-300 py-2",
              scrolled ? "text-[#2D5C34] hover:text-[#C6A96C]" : "text-white/80 hover:text-white"
            )}
          >
            Productos
          </Link>
          <Link 
            href="/nosotros" 
            onClick={closeMobileMenu} 
            className={cn(
              "block font-body text-sm uppercase tracking-widest transition-colors duration-300 py-2",
              scrolled ? "text-[#2D5C34] hover:text-[#C6A96C]" : "text-white/80 hover:text-white"
            )}
          >
            Nosotros
          </Link>
          <Link 
            href="/beneficios" 
            onClick={closeMobileMenu} 
            className={cn(
              "block font-body text-sm uppercase tracking-widest transition-colors duration-300 py-2",
              scrolled ? "text-[#2D5C34] hover:text-[#C6A96C]" : "text-white/80 hover:text-white"
            )}
          >
            Beneficios
          </Link>
          <Link 
            href="/galeria" 
            onClick={closeMobileMenu} 
            className={cn(
              "block font-body text-sm uppercase tracking-widest transition-colors duration-300 py-2",
              scrolled ? "text-[#2D5C34] hover:text-[#C6A96C]" : "text-white/80 hover:text-white"
            )}
          >
            Galería
          </Link>
          <Link 
            href="/tienda"
            onClick={closeMobileMenu} 
            className={cn(
              "block font-body text-sm uppercase tracking-widest transition-colors duration-300 py-2",
              scrolled ? "text-[#2D5C34] hover:text-[#C6A96C]" : "text-white/80 hover:text-white"
            )}
          >
            Tienda
          </Link>
          <Link 
            href="/contacto" 
            onClick={closeMobileMenu} 
            className={cn(
              "block text-center border py-3 px-6 font-body text-sm uppercase tracking-wider transition-all duration-300",
              scrolled
                ? "border-[#C6A96C] text-[#2D5C34] hover:bg-[#C6A96C] hover:text-white" 
                : "border-white/50 text-white hover:bg-white/10"
            )}
          >
            Contacto
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
