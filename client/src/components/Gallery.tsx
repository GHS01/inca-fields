import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, ZoomIn, X, Clock, Users, ChefHat, UtensilsCrossed } from 'lucide-react';
import React from 'react';

type RecipeInfo = {
  tiempo: string;
  porciones: string;
  dificultad: string;
  ingredientes: string[];
  pasos: string[];
};

type GalleryItem = {
  id: number;
  image: string;
  alt: string;
  category: 'platos' | 'ingredientes' | 'cultivo';
  description: string;
  receta?: RecipeInfo;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: "/images/Tostada de aguacate con huevo pochado y semillas de chía.jpg",
    alt: "Tostada de aguacate con huevo pochado y semillas de chía",
    category: 'platos',
    description: "Una exquisita combinación de aguacate cremoso con huevo pochado y el toque crujiente de las semillas de chía. Este plato es tan saludable como delicioso, ideal para un desayuno energético o brunch elegante.",
    receta: {
      tiempo: "20 minutos",
      porciones: "2 personas",
      dificultad: "Media",
      ingredientes: [
        "2 rebanadas de pan integral de masa madre",
        "1 aguacate Hass Premium",
        "2 huevos frescos",
        "2 cucharaditas de semillas de chía",
        "Jugo de medio limón",
        "Sal marina y pimienta recién molida",
        "Brotes frescos para decorar (opcional)",
        "Aceite de oliva extra virgen"
      ],
      pasos: [
        "Tostar el pan hasta que esté dorado y crujiente.",
        "Preparar el aguacate: pelar y quitar el hueso. Machacar la pulpa con un tenedor, añadir jugo de limón, sal y pimienta al gusto.",
        "Extender la mezcla de aguacate sobre las tostadas.",
        "Para el huevo pochado: hervir agua con un chorrito de vinagre, reducir el fuego, crear un remolino con una cuchara y deslizar el huevo suavemente. Cocinar por 3 minutos.",
        "Retirar el huevo con una espumadera y colocarlo sobre la tostada de aguacate.",
        "Espolvorear con semillas de chía, un poco de sal y pimienta.",
        "Finalizar con un chorrito de aceite de oliva y decorar con brotes frescos si se desea."
      ]
    }
  },
  {
    id: 2,
    image: "/images/Sushi con aguacate y salmón premium.jpg",
    alt: "Sushi con aguacate y salmón premium",
    category: 'platos',
    description: "Una fusión perfecta entre la tradición japonesa y nuestro aguacate premium. Cada rollo es una obra maestra donde el aguacate aporta cremosidad y el salmón un sabor excepcional, creando una experiencia gastronómica de alta cocina.",
    receta: {
      tiempo: "45 minutos",
      porciones: "4 personas (16 piezas)",
      dificultad: "Alta",
      ingredientes: [
        "2 tazas de arroz para sushi",
        "4 láminas de alga nori",
        "1 aguacate Hass Premium",
        "200g de salmón premium fresco",
        "3 cucharadas de vinagre de arroz",
        "1 cucharada de azúcar",
        "1/2 cucharadita de sal",
        "Salsa de soja",
        "Wasabi",
        "Jengibre encurtido"
      ],
      pasos: [
        "Lavar el arroz hasta que el agua salga clara. Cocinarlo según las instrucciones del paquete.",
        "Mezclar el vinagre, azúcar y sal. Incorporar al arroz caliente y mezclar suavemente.",
        "Dejar enfriar el arroz hasta temperatura ambiente.",
        "Cortar el aguacate en tiras finas. Cortar el salmón en tiras de aproximadamente 1 cm de grosor.",
        "Colocar una lámina de alga nori sobre una esterilla de bambú con la parte brillante hacia abajo.",
        "Extender una capa fina y uniforme de arroz sobre el alga, dejando 2 cm libres en la parte superior.",
        "Colocar las tiras de aguacate y salmón en el centro del arroz.",
        "Enrollar firmemente usando la esterilla, presionando suavemente.",
        "Con un cuchillo afilado y humedecido, cortar el rollo en 4 piezas iguales.",
        "Servir con salsa de soja, wasabi y jengibre encurtido."
      ]
    }
  },
  {
    id: 3,
    image: "/images/Guacamole fresco con lima y cilantro.jpg",
    alt: "Guacamole fresco con lima y cilantro",
    category: 'platos',
    description: "Nuestro guacamole artesanal combina la cremosidad de los aguacates Hass Premium con el toque cítrico de la lima y la frescura del cilantro. Una receta tradicional elevada a la perfección con ingredientes de la más alta calidad.",
    receta: {
      tiempo: "15 minutos",
      porciones: "4 personas",
      dificultad: "Baja",
      ingredientes: [
        "3 aguacates Hass Premium maduros",
        "1 tomate mediano, sin semillas y picado fino",
        "1/2 cebolla roja picada finamente",
        "1 chile jalapeño sin semillas (opcional)",
        "2 cucharadas de cilantro fresco picado",
        "Jugo de 2 limas",
        "Sal marina al gusto",
        "1/4 cucharadita de comino molido"
      ],
      pasos: [
        "Cortar los aguacates por la mitad, retirar el hueso y extraer la pulpa en un recipiente.",
        "Machacar los aguacates con un tenedor hasta obtener la consistencia deseada (puede ser más o menos rústica según preferencia).",
        "Incorporar inmediatamente el jugo de lima para evitar que el aguacate se oxide.",
        "Añadir el tomate, la cebolla y el jalapeño picados finamente.",
        "Incorporar el cilantro picado, la sal y el comino.",
        "Mezclar suavemente todos los ingredientes hasta integrarlos.",
        "Probar y ajustar el sabor con más sal o jugo de lima si es necesario.",
        "Servir inmediatamente con totopos o como acompañamiento."
      ]
    }
  },
  {
    id: 4,
    image: "/images/Aguacates frescos recien cocechados.jpg",
    alt: "Aguacates frescos recién cosechados",
    category: 'ingredientes',
    description: "Nuestros aguacates son cosechados a mano en el punto perfecto de maduración para garantizar su máximo sabor y textura. Cada pieza es seleccionada cuidadosamente por expertos agricultores que valoran la calidad sobre la cantidad, asegurando que solo los mejores ejemplares lleguen a su mesa. Cultivados en las fértiles tierras de los valles andinos, nuestros aguacates son 100% naturales, sin aditivos ni conservantes, preservando todas sus propiedades nutricionales y su incomparable sabor cremoso."
  },
  {
    id: 5,
    image: "/images/Plato gourmet con aguacate y langostinos.jpg",
    alt: "Plato gourmet con aguacate y langostinos",
    category: 'platos',
    description: "Una sofisticada creación donde el aguacate y los langostinos crean una sinfonía de sabores y texturas. Este plato de alta cocina realza la suavidad del aguacate con el sabor marino de los langostinos, todo armonizado con hierbas frescas y acentos cítricos.",
    receta: {
      tiempo: "30 minutos",
      porciones: "2 personas",
      dificultad: "Media",
      ingredientes: [
        "12 langostinos grandes, pelados y desvenados",
        "2 aguacates Hass Premium",
        "2 cucharadas de aceite de oliva",
        "1 diente de ajo picado",
        "1 limón (jugo y ralladura)",
        "2 cucharadas de eneldo fresco picado",
        "1/4 taza de yogur griego",
        "Sal marina y pimienta negra recién molida",
        "Microgreens para decorar"
      ],
      pasos: [
        "Sazonar los langostinos con sal, pimienta y un poco de ralladura de limón.",
        "Calentar el aceite de oliva en una sartén y saltear los langostinos con el ajo por 2 minutos por cada lado hasta que estén rosados y cocidos. Reservar.",
        "Cortar los aguacates en mitades, quitar el hueso y hacer cortes en la pulpa sin perforar la piel.",
        "En un bol pequeño, mezclar el yogur con el eneldo, jugo de limón, sal y pimienta.",
        "Para servir, colocar medio aguacate en cada plato, acomodar los langostinos alrededor y sobre el aguacate.",
        "Rociar con la salsa de yogur y decorar con más eneldo y microgreens.",
        "Terminar con un chorrito de aceite de oliva y servir inmediatamente."
      ]
    }
  },
  {
    id: 6,
    image: "/images/Smoothie de aguacate, arandanos, brambuesa y platano.jpg",
    alt: "Smoothie de aguacate, arándanos, frambuesa y plátano",
    category: 'platos',
    description: "Una bebida nutritiva y refrescante que combina la cremosidad del aguacate con la dulzura del plátano y el toque ácido de los frutos rojos. Esta deliciosa mezcla no solo es un placer para el paladar sino también una fuente de antioxidantes y energía natural.",
    receta: {
      tiempo: "10 minutos",
      porciones: "2 personas",
      dificultad: "Baja",
      ingredientes: [
        "1 aguacate Hass Premium",
        "1 plátano maduro",
        "1/2 taza de arándanos frescos",
        "1/2 taza de frambuesas",
        "1 taza de leche de almendras",
        "1 cucharada de miel de abeja o jarabe de agave",
        "1/2 taza de hielo",
        "1 cucharada de semillas de chía (opcional)"
      ],
      pasos: [
        "Pelar y quitar el hueso del aguacate.",
        "Pelar el plátano y cortarlo en trozos.",
        "Lavar los arándanos y las frambuesas.",
        "Colocar todos los ingredientes en la licuadora, comenzando con la leche de almendras.",
        "Licuar a velocidad alta hasta obtener una mezcla suave y cremosa.",
        "Probar y ajustar la dulzura añadiendo más miel si es necesario.",
        "Si deseas una textura más líquida, puedes añadir más leche de almendras.",
        "Servir inmediatamente en vasos altos, decorar con algunas frutas y semillas de chía por encima."
      ]
    }
  },
  {
    id: 7,
    image: "/images/Campos de aguacate.jpg",
    alt: "Campos de aguacate en el valle andino",
    category: 'cultivo',
    description: "Nuestros extensos campos de aguacate se encuentran estratégicamente ubicados en los privilegiados valles andinos, donde la combinación perfecta de altitud, clima y suelo mineral crea condiciones ideales para el cultivo. A más de 1,500 metros sobre el nivel del mar, nuestras plantaciones reciben la cantidad óptima de luz solar y humedad, permitiendo un desarrollo lento y natural de cada fruto. Implementamos técnicas de agricultura sostenible que respetan el equilibrio natural del ecosistema, empleando sistemas de riego por goteo que maximizan la eficiencia del agua y utilizando abonos orgánicos que mantienen la salud del suelo. Cada hectárea de nuestros campos es un testimonio de nuestro compromiso con la calidad y la preservación del medio ambiente para las generaciones futuras."
  },
  {
    id: 8,
    image: "/images/Postre de mousse de chocolate con aguacate.jpg",
    alt: "Postre de mousse de chocolate con aguacate",
    category: 'platos',
    description: "Un postre sofisticado que redefine el lujo culinario al combinar el intenso sabor del chocolate con la suavidad del aguacate. Esta mousse sedosa sorprende por su textura perfecta y profundidad de sabor, sin revelar su saludable secreto.",
    receta: {
      tiempo: "20 minutos + 2 horas de refrigeración",
      porciones: "4 personas",
      dificultad: "Media",
      ingredientes: [
        "2 aguacates Hass Premium maduros",
        "200g de chocolate negro (70% cacao)",
        "3 cucharadas de cacao en polvo sin azúcar",
        "1/4 taza de miel de abeja o jarabe de arce",
        "1 cucharadita de extracto de vainilla",
        "2 cucharadas de leche de coco",
        "Una pizca de sal marina",
        "Frambuesas frescas y hojas de menta para decorar",
        "Virutas de chocolate para servir"
      ],
      pasos: [
        "Derretir el chocolate negro a baño maría o en el microondas a intervalos de 30 segundos, removiendo entre cada intervalo. Dejar enfriar ligeramente.",
        "Pelar y quitar el hueso de los aguacates. Colocar la pulpa en un procesador de alimentos.",
        "Añadir el chocolate derretido, el cacao en polvo, la miel, el extracto de vainilla, la leche de coco y la sal.",
        "Procesar hasta obtener una mezcla suave y homogénea, raspando los bordes si es necesario.",
        "Probar y ajustar la dulzura según preferencia.",
        "Dividir la mousse en 4 copas o vasos elegantes.",
        "Refrigerar por al menos 2 horas para que se afirme.",
        "Antes de servir, decorar con frambuesas frescas, una hoja de menta y virutas de chocolate."
      ]
    }
  },
  {
    id: 9,
    image: "/images/Trabajador seleccionando los mejores aguacates.jpg",
    alt: "Trabajador seleccionando los mejores aguacates",
    category: 'cultivo',
    description: "En Inca Fields, la selección de cada aguacate es un arte que requiere años de experiencia y un ojo entrenado. Nuestros maestros seleccionadores evalúan meticulosamente cada fruto, considerando su peso, firmeza, color y textura para garantizar que solo los ejemplares perfectos reciban nuestra etiqueta Premium. Este proceso artesanal, transmitido de generación en generación, es parte fundamental de nuestro compromiso con la excelencia. Trabajamos bajo principios de comercio justo, proporcionando condiciones laborales dignas y remuneración justa a nuestros colaboradores, muchos de los cuales provienen de familias con tradición agrícola que han trabajado con nosotros por décadas. Este conocimiento ancestral, combinado con técnicas modernas de control de calidad, asegura que cada aguacate que llega a su mesa representa lo mejor de nuestra cosecha."
  }
];

const GalleryImage = ({
  item,
  index,
  onClick
}: {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden group cursor-pointer rounded-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className="relative h-80 overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image overlay with zoom icon on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
            <ZoomIn className="text-white" size={32} strokeWidth={1.5} />
          </div>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-display text-lg">{item.alt}</p>
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs tracking-wider text-[#2D5C34] uppercase rounded-md">
        {item.category}
      </div>
    </motion.div>
  );
};

// Modal component for expanded view
const GalleryModal = ({
  item,
  onClose,
  onPrev,
  onNext
}: {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  if (!item) return null;

  const hasRecipe = item.category === 'platos' && item.receta;

  // Efecto para ocultar el header cuando se abre el modal
  React.useEffect(() => {
    // Obtener el header y aplicar estilo para ocultarlo
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none';
    }

    // También añadimos una clase al body para evitar el scroll en la página de fondo
    document.body.style.overflow = 'hidden';

    // Limpiar el efecto cuando se cierra el modal
    return () => {
      if (header) {
        header.style.display = '';
      }
      document.body.style.overflow = '';
    };
  }, []);

  // Función para obtener la nota del chef según la receta
  const getChefNote = (id: number) => {
    switch (id) {
      case 1: // Tostada de aguacate
        return "Para una experiencia óptima, asegúrese de que el huevo esté pochado perfectamente: la clara firme y la yema líquida. Los aguacates Inca Fields son ideales por su cremosidad y sabor equilibrado que complementa perfectamente el huevo.";
      case 2: // Sushi
        return "La clave para un sushi perfecto está en la temperatura del arroz y la frescura del aguacate. Corte el aguacate justo antes de preparar el rollo para evitar la oxidación y mantener su hermoso color verde.";
      case 3: // Guacamole
        return "El secreto de un guacamole perfecto es usar aguacates en su punto justo de maduración. Presione suavemente: si cede ligeramente, está perfecto. Añada el limón inmediatamente para preservar su color vibrante.";
      case 5: // Plato gourmet con langostinos
        return "La combinación de aguacate y langostinos crea un equilibrio perfecto entre cremosidad y frescura marina. Para un resultado más elegante, utilice un cortador circular para montar los langostinos sobre el aguacate.";
      case 6: // Smoothie
        return "Para lograr la perfecta cremosidad, asegúrese de que el aguacate esté bien maduro. Si desea un smoothie más espeso, añada menos líquido o más hielo; para uno más ligero, incremente la cantidad de leche de almendras.";
      case 8: // Mousse de chocolate
        return "El secreto de esta mousse es la perfecta combinación entre el chocolate de alta calidad y la cremosidad del aguacate. Nadie notará la presencia del aguacate, pero aportará una textura inigualable y beneficios nutricionales.";
      default:
        return "Los aguacates Inca Fields son perfectos para esta receta gracias a su textura cremosa y sabor excepcional. Para mejores resultados, utilice aguacates en su punto óptimo de maduración.";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 py-6 px-4 md:py-10 md:px-10 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Botones de navegación y cierre ahora están fuera del contenedor principal */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-white hover:text-[#C6A96C] z-[60] transition-colors duration-300 bg-black/40 p-2 rounded-full"
        aria-label="Close modal"
      >
        <X size={28} />
      </button>

      <button
        onClick={onPrev}
        className="fixed left-6 top-1/2 -translate-y-1/2 text-white hover:text-[#C6A96C] z-[60] transition-colors duration-300 bg-black/40 p-3 rounded-full"
        aria-label="Previous image"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={onNext}
        className="fixed right-6 top-1/2 -translate-y-1/2 text-white hover:text-[#C6A96C] z-[60] transition-colors duration-300 bg-black/40 p-3 rounded-full"
        aria-label="Next image"
      >
        <ChevronRight size={32} />
      </button>

      <motion.div
        className="bg-white w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-[350px] md:h-auto">
            <div className="absolute inset-0">
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/60 to-transparent pt-20">
              <div className="inline-block px-3 py-1 bg-[#C6A96C] text-white text-xs uppercase tracking-wider mb-2 rounded-sm">
                {item.category}
              </div>
              <h3 className="text-white font-display text-2xl md:text-3xl font-bold text-shadow">
                {item.alt}
              </h3>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
            {hasRecipe ? (
              <div>
                <div className="flex flex-col gap-4">
                  {/* Recipe Title - Matched with image style */}
                  <h2 className="text-[#2D5C34] font-display text-3xl font-bold mb-4 border-b border-[#C6A96C]/30 pb-5">
                    {item.alt}
                  </h2>

                  {/* Recipe Info in horizontal format - Updated to match new design */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 border-b border-[#C6A96C]/20 pb-6 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F9F6F0] flex items-center justify-center">
                        <Clock size={18} className="text-[#2D5C34]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#C6A96C] uppercase text-xs tracking-wider font-medium">TIEMPO TOTAL</span>
                        <span className="text-[#2D5C34] text-sm font-medium">{item.receta?.tiempo}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F9F6F0] flex items-center justify-center">
                        <ChefHat size={18} className="text-[#2D5C34]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#C6A96C] uppercase text-xs tracking-wider font-medium">DIFICULTAD</span>
                        <span className="text-[#2D5C34] text-sm font-medium">{item.receta?.dificultad}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F9F6F0] flex items-center justify-center">
                        <Users size={18} className="text-[#2D5C34]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#C6A96C] uppercase text-xs tracking-wider font-medium">PORCIONES</span>
                        <span className="text-[#2D5C34] text-sm font-medium">{item.receta?.porciones}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <div className="h-[1px] w-8 bg-[#C6A96C] mr-3"></div>
                      <h4 className="text-[#2D5C34] font-display text-xl font-bold">Ingredientes</h4>
                    </div>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {item.receta?.ingredientes.map((ingrediente, index) => (
                        <li key={index} className="leading-relaxed">{ingrediente}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Preparation */}
                  <div className="mt-3">
                    <div className="flex items-center mb-2">
                      <div className="h-[1px] w-8 bg-[#C6A96C] mr-3"></div>
                      <h4 className="text-[#2D5C34] font-display text-xl font-bold">Preparación</h4>
                    </div>
                    <ol className="list-none pl-0 text-gray-700 space-y-4">
                      {item.receta?.pasos.map((paso, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C6A96C] flex items-center justify-center text-white text-sm">
                            {index + 1}
                          </div>
                          <span className="leading-relaxed flex-1">{paso}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Nota del Chef */}
                  <div className="mt-6 bg-[#F9F6F0] border-l-2 border-[#C6A96C] p-4 rounded-r-md">
                    <div className="flex items-center mb-2">
                      <ChefHat size={18} className="text-[#C6A96C] mr-2" />
                      <h4 className="text-[#2D5C34] font-display text-lg font-bold">Nota del Chef</h4>
                    </div>
                    <p className="text-gray-700 italic text-sm leading-relaxed">
                      {getChefNote(item.id)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-6">
                  <div className="h-[1px] w-8 bg-[#C6A96C] mr-3"></div>
                  <h4 className="text-[#2D5C34] font-display text-xl font-bold">Acerca de esta imagen</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'todos'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  // Handle modal navigation
  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  // Category button component
  const CategoryButton = ({ name, label }: { name: string; label: string }) => (
    <button
      onClick={() => setSelectedCategory(name)}
      className={`transition-all duration-300 px-6 py-2 text-xs uppercase tracking-wider border ${
        selectedCategory === name
          ? 'bg-[#2D5C34] text-white border-[#2D5C34]'
          : 'bg-transparent text-[#2D5C34] border-[#2D5C34]/30 hover:border-[#2D5C34]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="gallery" className="py-28 bg-white relative" ref={ref}>
      {/* Subtle pattern background */}
      <div className="absolute inset-0 bg-[#F9F6F0] opacity-20 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C6A96C' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center mb-4">
              <div className="h-[1px] w-10 bg-[#C6A96C] mr-3"></div>
              <span className="text-[#2D5C34] text-sm tracking-[0.2em] uppercase font-light">Creaciones Culinarias</span>
              <div className="h-[1px] w-10 bg-[#C6A96C] ml-3"></div>
            </div>

            <h2 className="text-[#2D5C34] font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Galería <span className="text-[#C6A96C]">Gourmet</span>
            </h2>

            <p className="text-gray-600 font-body text-lg max-w-2xl mx-auto mb-10">
              Descubre la versatilidad de nuestros aguacates en creaciones culinarias espectaculares
              y el proceso de cultivo que los hace únicos.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <CategoryButton name="todos" label="Todos" />
              <CategoryButton name="platos" label="Platos" />
              <CategoryButton name="ingredientes" label="Ingredientes" />
              <CategoryButton name="cultivo" label="Cultivo" />
            </div>
          </motion.div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <GalleryImage
                key={item.id}
                item={item}
                index={index}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>

          {/* Modal gallery */}
          {selectedItem && (
            <GalleryModal
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="https://inca-fields-ghs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button-gold inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 max-w-full"
            >
              <span>Síguenos en Instagram</span>
              <ArrowRight size={14} className="sm:w-4 sm:h-4 w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
