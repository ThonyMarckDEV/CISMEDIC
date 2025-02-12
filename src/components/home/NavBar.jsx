import React, { useState, useEffect } from 'react';
import logo from '../../img/logo.png'; // Solo usa el logo negro
import { Link } from 'react-router-dom';
import AuthSection from './AuthSection'; // Importa el componente AuthSection

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* AuthSection por encima de la Navbar */}
      <AuthSection />
      {/* Navbar debajo de AuthSection */}
      <nav
        className={`fixed top-0 left-0 w-full p-6 flex justify-between items-center z-20 transition-all duration-300 ${
          isFixed ? 'bg-white shadow-md' : 'bg-white'
        }`}
        style={{ top: isFixed ? 0 : '40px' }}
      >
        {/* Línea de separación si está fija */}
        {isFixed && (
          <div
            className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"
            style={{ zIndex: 30 }}
          ></div>
        )}
        {/* Logo en la esquina izquierda */}
        <div className="flex items-center">
          <a href="/">
            <img
              src={logo} // Logo negro fijo
              alt="Cismedic Logo"
              className="h-16"
            />
          </a>
        </div>
        {/* Menú de navegación */}
        <div className="hidden md:flex space-x-8 z-30">
          <ul className="flex space-x-8">
            <li>
              <a
                href="/"
                className="text-black hover:text-gray-900 text-lg font-serif font-medium transition-all duration-300 hover:tracking-widest"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/staffmedico"
                className="block text-black hover:text-gray-900 text-lg font-serif font-medium transition-all duration-300 hover:tracking-widest"
                onClick={toggleMenu}
              >
                 Staff Medico
              </a>
            </li>
            <li>
              <a
                href="/contacto"
                className="text-black hover:text-gray-900 text-lg font-serif font-medium transition-all duration-300 hover:tracking-widest"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
        {/* Botón de menú móvil */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="md:hidden text-black focus:outline-none hover:scale-110 transition-transform duration-300 text-3xl p-3"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      {/* Menú móvil */}
      {isOpen && (
        <div className="fixed top-[110px] left-0 w-full bg-white z-40 md:hidden shadow-lg">
          <ul className="flex flex-col space-y-4 p-6">
            <li>
              <a
                href="/"
                className="block text-black hover:text-gray-900 text-lg font-serif font-medium transition-all duration-300 hover:tracking-widest"
                onClick={toggleMenu}
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/staffmedico"
                className="block text-black hover:text-gray-900 text-lg font-serif font-medium transition-all duration-300 hover:tracking-widest"
                onClick={toggleMenu}
              >
                Staff Medico
              </a>
            </li>
            <li>
              <a
                href="/contacto"
                className="block text-black hover:text-gray-900 text-lg font-serif font-medium transition-all duration-300 hover:tracking-widest"
                onClick={toggleMenu}
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;