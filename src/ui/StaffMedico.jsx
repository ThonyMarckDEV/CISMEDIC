import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/home/NavBar';
import Footer from '../components/home/Footer';
import SweetAlert from '../components/SweetAlert';
import LoaderScreen from '../components/home/LoadingScreen';
import laEmpresa from '../img/staff.jpeg';
import API_BASE_URL from '../js/urlHelper';
import imgperfil from '../img/defualtpefil.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function MedicalStaffDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/listarStaff?search=${searchTerm}&specialty=${selectedSpecialty}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      }
    };

    const fetchSpecialties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/listarespecialidadesStaff`);
        if (!response.ok) {
          throw new Error('Error al obtener especialidades');
        }
        const data = await response.json();
        setSpecialties(data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };

    fetchDoctors();
    fetchSpecialties();
  }, [searchTerm, selectedSpecialty]);


  const handleDoctorDetails = (doctorId) => {
    // Redirige a una página de detalles del doctor
    window.location.href = `/perfildoctor/${doctorId}`;
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 font-light text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={laEmpresa} alt="Fondo de contacto" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8">
            Nuestro Staff
          </motion.h1>
          <div className="w-32 h-1 bg-white mb-8 mx-auto"></div>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">
            Nuestro equipo de profesionales altamente capacitados está dedicado a brindarte el mejor servicio.
          </motion.p>
        </div>
      </motion.div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Encuentra al especialista que necesitas
        </h1>
        <div className="relative max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Busca por nombre o apellido del especialista"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="">Elige una especialidad</option>
                {specialties.map((spec) => (
                  <option key={spec.idEspecialidad} value={spec.nombre}>{spec.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.idUsuario}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-[400px] flex flex-col" // Altura ajustada aquí
              >
                <img
                  src={doctor.perfil ? `${API_BASE_URL}/storage/${doctor.perfil}` : imgperfil}
                  alt={doctor.nombres}
                  className="w-full h-60 object-cover" // Mantener la altura de la imagen
                />
                <div className="p-4 flex-grow flex flex-col justify-between"> {/* Flex para organizar el contenido */}
                  <div>
                    <div className="text-sm text-green-700 font-bold mb-2">{doctor.especialidad}</div>
                    <h3 className="text-xl font-bold mb-2">{`${doctor.nombres} ${doctor.apellidos}`}</h3>
                  </div>
                  <button
                    onClick={() => handleDoctorDetails(doctor.idUsuario)} // Función para manejar el clic
                    className="text-green-600 hover:text-green-700 transition-colors duration-300 self-start"
                  >
                    Conoce más →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}