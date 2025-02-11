import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import API_BASE_URL from '../../js/urlHelper';

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]); // Estado para almacenar las especialidades
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // Función para obtener las especialidades desde el backend
  const fetchSpecialties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/especialidadeshome`);
      if (!response.ok) {
        throw new Error('Error al obtener las especialidades');
      }
      const data = await response.json();
      setSpecialties(data); // Guardar las especialidades en el estado
      setLoading(false); // Indicar que la carga ha terminado
    } catch (error) {
      console.error('Error fetching specialties:', error);
      setLoading(false); // Indicar que la carga ha terminado (incluso si hay un error)
    }
  };

  // Ejecutar la función al cargar el componente
  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 bg-gray-50 text-center">
        <p className="text-gray-600">Cargando especialidades...</p>
      </div>
    );
  }

  // Mostrar un mensaje si no hay especialidades
  if (specialties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 bg-gray-50 text-center">
        <p className="text-gray-600">No se encontraron especialidades.</p>
      </div>
    );
  }

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
              <div className="text-5xl mb-6 text-center">{specialty.icono}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {specialty.nombre}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {specialty.descripcion}
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Specialties;