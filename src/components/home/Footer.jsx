import React from 'react';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserMd } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-white text-black py-12">
      <div className="container mx-auto px-6">
        {/* Contenedor de columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-3xl font-extrabold tracking-wider mb-4">
              CISMEDIC
            </div>
            <p className="text-center md:text-left text-lg font-medium flex items-center">
              Somos una Clínica, con profesionales competentes en las diferentes áreas 🧑‍⚕️👩‍⚕️💚
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-gray-400">Inicio</a></li>
              <li><a href="/nosotros" className="hover:text-gray-400">Nosotros</a></li>
              <li><a href="/servicios" className="hover:text-gray-400">Servicios</a></li>
              <li><a href="/especialidades" className="hover:text-gray-400">Especialidades</a></li>
              <li><a href="/contacto" className="hover:text-gray-400">Contacto</a></li>
              <li>
                <a href="/login" className="hover:text-gray-400 flex items-center justify-center md:justify-start">
                  <FaUserMd className="mr-2" /> Área de Pacientes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de contacto */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-2" />
                Av. Javier Prado 1234, San Isidro - Lima
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-2" />
                Calle Los Alamos 567, Miraflores - Lima
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaPhone className="mr-2" />
                (01) 123 4567
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-2" />
                info@cismedic.com
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-2" />
                emergencias@cismedic.com
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes sociales */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="https://www.facebook.com/cismedic" className="text-black hover:text-gray-400">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.instagram.com/cismedic" className="text-black hover:text-gray-400">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CISMEDIC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;