import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/home/NavBar';
import Footer from '../components/home/Footer';
import SweetAlert from '../components/SweetAlert';
import LoaderScreen from '../components/home/LoadingScreen';
import laEmpresa from '../img/staff.jpeg';

const doctors = [
  {
    id: 1,
    name: "Dr. Benny Chavez Luis Alberto",
    title: "GINECOLOGÍA",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BC147AFFD-FA11-482E-924F-BDCBA89CCFB0%7D-V99MUJ2tsJrNFT0oob0wnJyfgptEJu.png",
  },
  {
    id: 2,
    name: "Dr. Alberto Jepeto Saldarriaga",
    title: "CARDIOLOGIA",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%7BC147AFFD-FA11-482E-924F-BDCBA89CCFB0%7D-V99MUJ2tsJrNFT0oob0wnJyfgptEJu.png",
  },
  
];

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

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSpecialty === '' || doctor.title.toLowerCase().includes(selectedSpecialty.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 font-light text-gray-800 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src={laEmpresa}
          alt="Fondo de contacto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8"
          >
            Nuestro Staff
          </motion.h1>
          <div className="w-32 h-1 bg-white mb-8 mx-auto"></div>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light"
          >
            Nuestro equipo de profesionales altamente capacitados está dedicado a brindarte el mejor servicio.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Encuentra al especialista que necesitas
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Busca por nombre o apellido del especialista"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>

        {/* Filters and Doctors Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
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
                <option value="ginecologia">Ginecología</option>
                <option value="cardiologia">Cardiología</option>
              </select>
            </div>
            <button
              className="w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-300"
            >
              Aplicar filtros
            </button>
          </div>

          {/* Doctors Grid */}
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
                }}
                style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }} // Valor inicial compatible
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-4">
                  <div className="text-sm text-green-700 font-bold mb-2">{doctor.title}</div>
                  <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{doctor.specialty}</p>
                  <button
                    className="text-green-600 hover:text-green-700 transition-colors duration-300"
                  >
                    Conoce más →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}