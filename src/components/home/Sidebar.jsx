import React, { useState } from 'react';
import { Menu, ChevronDown, User } from 'lucide-react';
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom
import logo from '../../img/logo.png'; // Reemplaza con la ruta de tu logo
import { logout } from '../../js/logout';

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar la Sidebar
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Estado para el menú desplegable del perfil

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar with Logo and Profile */}
      <div className="bg-white h-16 flex items-center justify-between px-4 shadow-md">
        {/* Left Section: Logo and Hamburguer Menu for Mobile */}
        <div className="flex items-center space-x-2">
          {/* Hamburguer Menu for Mobile */}
          <button
            className="md:hidden" // Solo visible en móviles
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Alternar la visibilidad de la Sidebar
          >
            <Menu className="text-black w-6 h-6" />
          </button>

          {/* Logo */}
          <img
            src={logo} // Reemplaza con la ruta de tu logo
            alt="Cismedic Logo"
            className="w-12 h-12 md:w-24 md:h-16" // Logo más ancho
          />
        </div>

        {/* Right Section: Profile and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 text-black"
          >
            <User className="w-6 h-6" />
            <ChevronDown className="w-4 h-4" />
          </button>
          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-10">
              <ul className="text-gray-700">
                {/* Cada elemento usa Link para redirigir a una ruta */}
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/perfil" className="block w-full h-full">
                    Perfil
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link to="/configuracion" className="block w-full h-full">
                    Configuración
                  </Link>
                </li>
                <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors duration-300"
                    >
                      Cerrar sesión
                </button>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Desktop and Mobile */}
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`md:flex md:flex-col md:w-64 bg-white text-black min-h-screen border-r border-gray-200 ${
            isSidebarOpen ? 'block' : 'hidden'
          } md:block`}
        >
          {/* Sidebar Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                <Link to="/inicio" className="block w-full h-full">
                  Inicio
                </Link>
              </li>
              <li className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                <Link to="/citas" className="block w-full h-full">
                  Citas
                </Link>
              </li>
              <li className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                <Link to="/historial" className="block w-full h-full">
                  Historial
                </Link>
              </li>
              <li className="hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                <Link to="/configuracion" className="block w-full h-full">
                  Configuración
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:ml-64">
          {/* Children Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;