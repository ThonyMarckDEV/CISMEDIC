import React from 'react';
import Navbar from '../components/home/NavBar';
import Slider from '../components/home/Slider';
import Footer from '../components/home/Footer';
import { motion } from 'framer-motion';

const Home = () => {

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="text-white">
      {/* Navbar */}
      <Navbar />
  
      {/* Slider con texto superpuesto */}
      <div className="relative mt-20"> {/* Añade un margen superior para evitar que el contenido quede oculto detrás de la Navbar */}
        <Slider />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;