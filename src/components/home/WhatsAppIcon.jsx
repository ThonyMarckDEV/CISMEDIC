import React, { useState } from 'react';

const WhatsAppIcon = () => {
  const [isHovered, setIsHovered] = useState(false); // Estado para controlar el hover en PC
  const [isTouched, setIsTouched] = useState(false); // Estado para controlar el touch en móvil

  const whatsappNumber1 = '968103600'; // Primer número de WhatsApp
  const whatsappNumber2 = '968104900'; // Segundo número de WhatsApp
  const whatsappLink1 = `https://wa.me/${whatsappNumber1}`; // Enlace al primer número
  const whatsappLink2 = `https://wa.me/${whatsappNumber2}`; // Enlace al segundo número

  // Función para manejar el cierre al tocar fuera en móvil
  const handleClickOutside = (e) => {
    if (!e.target.closest('.whatsapp-container')) {
      setIsTouched(false);
    }
  };

  // Agregar un event listener para detectar clics fuera en móvil
  React.useEffect(() => {
    if (isTouched) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isTouched]);

  return (
    <div
      className="fixed bottom-8 right-5 z-50 whatsapp-container"
      onMouseEnter={() => setIsHovered(true)} // Mostrar barra al pasar el mouse en PC
      onMouseLeave={() => setIsHovered(false)} // Ocultar barra al retirar el mouse en PC
      onClick={() => setIsTouched(!isTouched)} // Alternar barra al tocar en móvil
    >
      {/* Ícono principal de WhatsApp */}
      <div className="p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 cursor-pointer">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-12 h-12"
        />
      </div>

      {/* Barra desplegable con los dos íconos */}
      {(isHovered || isTouched) && (
        <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
          <a
            href={whatsappLink1}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp 1"
              className="w-8 h-8"
            />
          </a>
          <a
            href={whatsappLink2}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp 2"
              className="w-8 h-8"
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default WhatsAppIcon;