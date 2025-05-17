import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D5C34] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-display text-2xl font-bold mb-6">
              Inca Fields<span className="text-[#C6A96C] italic ml-1">Premium</span>
            </h3>
            <p className="font-body mb-6">
              Cultivando aguacates Premium con pasión y tradición desde 2010. Calidad excepcional para paladares exigentes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#C6A96C] transition-colors duration-300">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-[#C6A96C] transition-colors duration-300">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-[#C6A96C] transition-colors duration-300">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-[#C6A96C] transition-colors duration-300">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="font-body space-y-3">
              <li><a href="#home" className="hover:text-[#C6A96C] transition-colors duration-300">Inicio</a></li>
              <li><a href="#products" className="hover:text-[#C6A96C] transition-colors duration-300">Productos</a></li>
              <li><a href="#about" className="hover:text-[#C6A96C] transition-colors duration-300">Nosotros</a></li>
              <li><a href="#benefits" className="hover:text-[#C6A96C] transition-colors duration-300">Beneficios</a></li>
              <li><a href="#gallery" className="hover:text-[#C6A96C] transition-colors duration-300">Galería</a></li>
              <li><a href="#contact" className="hover:text-[#C6A96C] transition-colors duration-300">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-bold mb-6">Contacto</h4>
            <ul className="font-body space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-[#C6A96C]" size={16} />
                <span>Av. Blv de la Literatura 164, Lima, Perú</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3 text-[#C6A96C]" size={16} />
                <span>+51 998 148 917</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-3 text-[#C6A96C]" size={16} />
                <span>peru.aguacates@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3 text-[#C6A96C]" size={16} />
                <span>Lun - Vie: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-bold mb-6">Certificaciones</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-3 flex items-center justify-center">
                <i className="fas fa-award text-3xl text-[#C6A96C]"></i>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 flex items-center justify-center">
                <i className="fas fa-leaf text-3xl text-[#C6A96C]"></i>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 flex items-center justify-center">
                <i className="fas fa-certificate text-3xl text-[#C6A96C]"></i>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 flex items-center justify-center">
                <i className="fas fa-globe-americas text-3xl text-[#C6A96C]"></i>
              </div>
            </div>
            <p className="font-body text-sm mt-4">
              Todos nuestros productos cumplen con los más altos estándares internacionales de calidad y sostenibilidad.
            </p>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <p className="font-body text-sm text-white text-opacity-70 mb-4 md:mb-0">
              © {currentYear} Inca Fields. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-4 justify-start md:justify-end">
              <a href="#" className="font-body text-sm text-white text-opacity-70 hover:text-opacity-100">Política de Privacidad</a>
              <a href="#" className="font-body text-sm text-white text-opacity-70 hover:text-opacity-100">Términos y Condiciones</a>
              <a href="#" className="font-body text-sm text-white text-opacity-70 hover:text-opacity-100">Envíos</a>
              <a href="#" className="font-body text-sm text-white text-opacity-70 hover:text-opacity-100">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
