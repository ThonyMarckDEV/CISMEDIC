import React from 'react';
import Navbar from '../components/home/NavBar';
import Slider from '../components/home/Slider';
import Footer from '../components/home/Footer';
import Specialties from '../components/home/Specialties';
import AppDownload from '../components/home/AppDownload';
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
      <div className="relative mt-20">
        <Slider />
      </div>

      {/* Specialties Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Specialties />
      </motion.div>

      {/* App Download Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <AppDownload />
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;