import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar la sección actual de la página
 * @returns Un objeto con la sección actual y un booleano que indica si estamos en la sección de inicio
 */
export function useCurrentSection() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [isHomeSection, setIsHomeSection] = useState<boolean>(true);

  useEffect(() => {
    // Función para detectar la sección actual basada en el scroll
    const handleScroll = () => {
      // Obtener todas las secciones
      const sections = document.querySelectorAll('section[id]');
      
      // Obtener la posición actual del scroll
      const scrollPosition = window.scrollY + 100; // Añadir un pequeño offset
      
      // Encontrar la sección actual
      let currentSectionId = 'home';
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.id;
        }
      });
      
      // Actualizar el estado
      setCurrentSection(currentSectionId);
      setIsHomeSection(currentSectionId === 'home');
    };
    
    // Añadir el event listener
    window.addEventListener('scroll', handleScroll);
    
    // Llamar a la función una vez para establecer el valor inicial
    handleScroll();
    
    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return { currentSection, isHomeSection };
}
