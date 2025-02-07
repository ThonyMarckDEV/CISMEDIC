import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/home/NavBar';
import Footer from '../components/home/Footer';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import pinImage from '../img/marcador.png';
import API_BASE_URL from '../js/urlHelper';
import LoaderScreen from '../components/home/LoadingScreen';
import SweetAlert from '../components/SweetAlert';
import laEmpresa from '../img/2.jpg';

const StaffMedico = () => {
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };


  return (
    <div className="bg-gradient-to-b from-white to-gray-100 font-light text-gray-800 min-h-screen flex flex-col">
      <Navbar />

        {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative h-[70vh] flex items-center justify-center overflow-hidden"
          >
            {/* Overlay oscuro para mejorar la legibilidad del texto */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Imagen de fondo */}
            <img
              src={laEmpresa} // Reemplaza con la ruta de tu imagen
              alt="Fondo de contacto"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Contenido del Hero Section */}
            <div className="container relative z-10 mx-auto px-6 text-center">
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8"
              >
                Contáctanos
              </motion.h1>
              <div className="w-32 h-1 bg-white mb-8 mx-auto"></div>
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light"
              >
                Estamos aquí para ayudarte. Contáctanos y un especialista te atenderá pronto.
              </motion.p>
            </div>
          </motion.div>

          
      <div className="container mx-auto px-6 pt-24 pb-16">

      </div>
      <Footer />
    </div>
  );
};

export default StaffMedico;