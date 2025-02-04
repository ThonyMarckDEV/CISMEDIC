import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, User, Home, Calendar, FileText, Layout, CreditCard, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Importa useLocation
import logo from '../../img/logo.png';
import { logout } from '../../js/logout';

const navigation = [
  { name: "Inicio", href: "/cliente", icon: Home },
  { name: "Nueva cita", href: "/cliente/nuevacita", icon: Calendar },
  { name: "Mis Citas", href: "/cliente/miscitas", icon: FileText },
  { name: "Programas", href: "/cliente/programas", icon: Layout },
  { name: "Mis Pagos", href: "/cliente/mispagos", icon: CreditCard },
  { name: "Ayuda", href: "/ayuda", icon: HelpCircle },
];

const SidebarCliente = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation(); // Obtén la ruta actual

  // Función para cerrar la sidebar al hacer clic fuera de ella
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar with Logo and Profile */}
      <div className="bg-white h-16 flex items-center justify-between px-4 shadow-md">
        {/* Left Section: Logo and Hamburguer Menu for Mobile */}
        <div className="flex items-center space-x-2">
          {/* Hamburguer Menu for Mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="text-black w-6 h-6" />
          </button>

          {/* Logo */}
          <img
            src={logo}
            alt="Cismedic Logo"
            className="w-12 h-12 md:w-24 md:h-16"
          />
        </div>

        {/* Right Section: Profile and Dropdown */}
        <div className="relative flex justify-center items-center">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 text-black"
          >
            <User className="w-6 h-6" />
            <ChevronDown className="w-4 h-4" />
          </button>
          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50 w-48">
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center">
                  <Link to="/perfil" className="block w-full h-full">
                    Perfil
                  </Link>
                </li>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors duration-300 text-center"
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
        {/* Dashboard Sidebar */}
        <div
          ref={sidebarRef}
          className={`md:flex md:flex-col md:w-64 bg-white text-black min-h-screen border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:relative z-20`}
        >
          {/* Sidebar Content */}
          <div className="flex-1 p-4">
            <nav>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 p-2 rounded-md ${
                        location.pathname === item.href // Compara la ruta actual con la del ítem
                          ? 'bg-blue-400 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer Section */}
            <div className="mt-auto p-4">
              <div className="text-xs text-gray-500">
                <p>¿Tienes alguna duda o inconveniente?</p>
                <p>Contáctanos a:</p>
                <a href="mailto:soporteapp.pe@auna.org" className="text-blue-500 hover:underline">
                  soporteapp.pe@cismedic.org
                </a>
                <p className="mt-2">
                  <a href="#" className="text-blue-500 hover:underline">
                    Whatsapp Cismedic
                  </a>
                </p>
              </div>
            </div>
          </div>
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

export default SidebarCliente;