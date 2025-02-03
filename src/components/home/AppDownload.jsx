import React from 'react';
import { motion } from 'framer-motion';
import appImage from '../../img/app.jpg'; // Importar la imagen

const AppDownload = () => {
  return (
    <div className="bg-white text-gray-900 py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="z-10 relative md:w-1/2 space-y-6">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-black mb-4"
          >
            EN EL APP CISMEDIC
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-semibold text-gray-800 mb-6 leading-tight"
          >
            Cuidamos tu salud y<br />
            también tu tiempo
          </motion.h3>
          <motion.ul
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 mb-8 text-gray-700"
          >
            {[
              "Agenda tus citas médicas en cualquier momento.",
              "Accede a tu historial de citas.",
              "Visualiza tus recetas y resultados de laboratorio.",
              "Utiliza tus programas de salud CISMEDIC para atenderte."
            ].map((item, index) => (
              <li 
                key={index} 
                className="flex items-center space-x-3"
              >
                <svg 
                  className="w-6 h-6 text-black" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold 
            hover:bg-gray-700 transition-colors duration-300 
            shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Descargar App CISMEDIC
          </motion.button>
        </div>

        {/* Phone Mockup */}
        <motion.div 
          className="md:w-1/2 relative flex justify-center items-center mt-12 md:mt-0"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-100 w-72 h-[550px] rounded-3xl relative overflow-hidden shadow-2xl border-8 border-gray-200">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-300 h-6 w-1/2 rounded-full"></div>
            <div className="bg-white w-full h-full p-4 overflow-hidden relative">
              <div className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full"></div>
              {/* Sliding app showcase */}
              <div className="h-full w-full bg-gray-100 rounded overflow-hidden">
                <div className="animate-slide-images flex h-full">
                  {/* Imagen de la app */}
                  <div className="min-w-full h-full">
                    <img
                      src={appImage} // Usar la imagen importada
                      alt="App CISMEDIC"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppDownload;