import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/home/NavBar';
import Footer from '../components/home/Footer';
import DoctorList from '../components/home/DoctorList';
import laEmpresa from '../img/staff.jpeg';
import API_BASE_URL from '../js/urlHelper';

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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/listarStaff?search=${searchTerm}&specialty=${selectedSpecialty}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data);
        setCurrentPage(1); // Reset to first page when filters change
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
    window.location.href = `/perfildoctor/${doctorId}`;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
   // window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Header content remains the same */}
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
        {/* Search and filters remain the same */}
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
          
          {/* New DoctorList component */}
          <div className="w-full md:w-3/4">
            <DoctorList
              doctors={doctors}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onDoctorDetails={handleDoctorDetails}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}