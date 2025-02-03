import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../img/1.jpg';
import img2 from '../../img/2.jpg';
import img3 from '../../img/3.jpg';
import img4 from '../../img/4.jpg';

const slides = [
  {
    image: img1,
    title: "Cocinas Elegantes",
    description: "Descubre nuestra colección exclusiva de cocinas modernas y clásicas, diseñadas para brindar estilo y funcionalidad.",
    buttonText: "Ver más",
    buttonLink: "/catalogo?categoria=Cocinas",
  },
  {
    image: img2,
    title: "Escritorios Modernos",
    description: "Explora nuestra variedad de escritorios ergonómicos y contemporáneos, perfectos para tu espacio de trabajo.",
    buttonText: "Explorar",
    buttonLink: "/catalogo?categoria=Escritorios",
  },
  {
    image: img3,
    title: "Sofás de Lujo",
    description: "Encuentra sofás y muebles de alta calidad, diseñados para ofrecer comodidad y elegancia suprema.",
    buttonText: "Descubrir",
    buttonLink: "/catalogo?categoria=Sofas",
  },
  {
    image: img4,
    title: "Centros de Entretenimiento",
    description: "Transforma tu espacio con nuestros modernos centros de entretenimiento, fusionando estilo y funcionalidad.",
    buttonText: "Comprar ahora",
    buttonLink: "/catalogo?categoria=Centros+De+Entretenimiento",
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
    <div className="relative w-full h-[85vh] overflow-hidden"> 
      <div className="relative w-full h-full flex">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 flex transition-all duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Enhanced Text Container */}
            <div className="w-1/2 h-full bg-white/95 backdrop-blur-sm relative flex items-center">
              <div 
                className="pl-12 lg:pl-24 pr-6 space-y-6 w-full max-w-[42rem]"
              >
                {/* Title with Enhanced Typography */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                
                {/* Description with Improved Readability */}
                <p className="text-xl md:text-2xl lg:text-3xl font-light text-gray-700 leading-relaxed">
                  {slide.description}
                </p>
                
                {/* Refined Button */}
                <Link to={slide.buttonLink}>
                  <button
                    className="mt-6 px-10 py-4 text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {slide.buttonText}
                  </button>
                </Link>
              </div>
            </div>
            {/* Image Container with Sophisticated Effects */}
            <div className="w-1/2 h-full relative overflow-hidden">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out"
              />
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-30" />
              
              {/* Gradiente adicional para fusión con el texto */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Dots with Elegant Design */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gray-900 scale-125 ring-2 ring-gray-900/30'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
      {/* Progress Bar with Refined Style */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 z-10">
        <div
          className="h-full bg-gray-900 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;