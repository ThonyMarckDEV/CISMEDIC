import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const specialties = [
  {
    title: "Medicina General",
    description: "Atención integral personalizada para tu bienestar integral",
    icon: "🩺"
  },
  {
    title: "Ginecología",
    description: "Cuidado especializado con la más alta tecnología y sensibilidad",
    icon: "👩‍⚕️"
  },
  {
    title: "Pediatría",
    description: "Acompañamiento profesional en cada etapa del crecimiento",
    icon: "👶"
  },
  {
    title: "Cardiología",
    description: "Diagnóstico avanzado y tratamiento de precisión cardiovascular",
    icon: "❤️"
  },
  {
    title: "Dermatología",
    description: "Cuidado de la piel con los mejores tratamientos y tecnología",
    icon: "🧴"
  },
  {
    title: "Ortopedia",
    description: "Soluciones especializadas para problemas musculoesqueléticos",
    icon: "🦴"
  },
  {
    title: "Neurología",
    description: "Atención experta en trastornos del sistema nervioso",
    icon: "🧠"
  },
  {
    title: "Oftalmología",
    description: "Cuidado visual con tecnología de vanguardia",
    icon: "👁️"
  }
];

const Specialties = () => {
  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50">
      <motion.h2 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center mb-12 text-green-800 tracking-tight"
      >
        Nuestras Especialidades
      </motion.h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="w-full"
      >
        {specialties.map((specialty, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="bg-white rounded-2xl shadow-1xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-t-4 border-green-700"
            >
              <div className="text-5xl mb-6 text-center">{specialty.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {specialty.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {specialty.description}
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Specialties;