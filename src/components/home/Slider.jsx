import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../img/1.jpg';
import img2 from '../../img/2.jpg';
import img3 from '../../img/3.jpg';
import img4 from '../../img/4.jpg';

const slides = [
  {
    image: img1,
    title: "Atención Médica de Calidad",
    description: "Brindamos servicios médicos con un equipo altamente capacitado, comprometido con el bienestar de cada paciente.",
  },
  {
    image: img2,
    title: "Especialidades Médicas",
    description: "Contamos con diversas especialidades médicas para ofrecerte el mejor diagnóstico y tratamiento.",
  },
  {
    image: img3,
    title: "Cuidado Empático",
    description: "Nuestro equipo de salud trabaja con empatía y dedicación para brindarte la mejor experiencia de atención.",
  },
  {
    image: img4,
    title: "Equipos de Alta Tecnología",
    description: "Disponemos de tecnología avanzada para garantizar diagnósticos precisos y tratamientos efectivos.",
  }
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
          return 0;
        }
        return prevProgress + 8;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const goToImage = (index) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
      <div className="relative w-full h-full flex">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col md:flex-row transition-all duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Text Container */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white/95 backdrop-blur-sm flex items-center justify-center md:justify-start">
              <div className="px-6 md:pl-12 lg:pl-24 md:pr-6 space-y-4 md:space-y-6 w-full max-w-[42rem] text-center md:text-left">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base md:text-xl lg:text-2xl font-light text-gray-700 leading-relaxed">
                  {slide.description}
                </p>
                {/* <Link to={slide.buttonLink}>
                  <button className="mt-4 md:mt-6 px-6 md:px-10 py-2 md:py-4 text-base md:text-lg font-medium text-white bg-green-700 hover:bg-green-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                    {slide.buttonText}
                  </button>
                </Link> */}
              </div>
            </div>
            {/* Image Container */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden order-first md:order-none">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out"
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 to-transparent opacity-30" />
              {/* Gradient for Mobile */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent md:hidden"></div>
              {/* Gradient for PC (Left Side) */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/90 to-transparent hidden md:block"></div>
              {/* Gradient for PC (Bottom) */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/80 to-transparent hidden md:block"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Dots */}
      <div className="absolute bottom-9 md:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-green-700 scale-125 ring-2 ring-gray-100'
                : 'bg-gray-300 hover:bg-green-500'
            }`}
          />
        ))}
      </div>
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 z-10">
        <div className="h-full bg-green-700 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Slider;