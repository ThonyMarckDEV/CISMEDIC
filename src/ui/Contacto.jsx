import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/home/NavBar';
import Footer from '../components/home/Footer';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import pinImage from '../img/marcador.png';
import API_BASE_URL from '../js/urlHelper';
import LoaderScreen from '../components/home/LoadingScreen';
import SweetAlert from '../components/SweetAlert';
import laEmpresa from '../img/2.jpg';

const Contacto = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        SweetAlert.showMessageAlert('Éxito', 'Mensaje enviado correctamente', 'success');
        setForm({ name: '', email: '', phone: '', message: '' }); // Limpiar el formulario
      } else {
        SweetAlert.showMessageAlert('Error', 'Error al enviar el mensaje: ' + (data.error || 'Inténtalo más tarde'), 'error');
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error de conexión: ' + error.message, 'error');
    } finally{
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderScreen />;
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };  

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 font-light text-gray-800 min-h-screen flex flex-col">
      <Navbar />

        {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative h-[70vh] flex items-center justify-center overflow-hidden"
          >
            {/* Overlay oscuro para mejorar la legibilidad del texto */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Imagen de fondo */}
            <img
              src={laEmpresa} // Reemplaza con la ruta de tu imagen
              alt="Fondo de contacto"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Contenido del Hero Section */}
            <div className="container relative z-10 mx-auto px-6 text-center">
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8"
              >
                Contáctanos
              </motion.h1>
              <div className="w-32 h-1 bg-white mb-8 mx-auto"></div>
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light"
              >
                Estamos aquí para ayudarte. Contáctanos y un especialista te atenderá pronto.
              </motion.p>
            </div>
          </motion.div>

          
      <div className="container mx-auto px-6 pt-24 pb-16">
    
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {[
            {
              title: "Dirección",
              content: ["José Gálvez 415, Sechura 20691"]
            },
            {
              title: "Teléfono",
              content: ["968 103 600 - 968 104 900"]
            },
            {
              title: "Correo",
              content: ["cismedic@cismedicbayovar.com"]
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-medium text-gray-900 mb-4">{item.title}</h3>
              {item.content.map((line, i) => (
                <p key={i} className="text-gray-600">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Ubicaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-light text-gray-900 mb-4">Ubicación</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuéntranos en nuestras sedes principales en Talara y Lima.
          </p>
        </motion.div>

        {/* Mapa con Pin */}
        <div className="relative mb-16" style={{ position: 'relative', zIndex: 1 }}>
          <MapContainer
            center={[-5.5554524,-80.8212228]}
            zoom={15}
            style={{
              height: '400px', // Altura por defecto para móviles
            }}
            className="mx-auto w-4/5 lg:w-2/3 lg:h-[500px]" // Ancho 80% en móviles y 2/3 en pantallas grandes, altura mayor en pantallas grandes
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[-5.5554524,-80.8212228]}
              icon={new L.Icon({
                iconUrl: pinImage, // Ruta a la imagen del pin
                iconSize: [100, 100],
              })}
            >
              <Popup>
                <strong>Muebles RCI</strong><br />
                Dirección: Av. Muebles RCI 123, Lima, Perú
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto py-16"
        >
          <h1 className="text-5xl font-light text-gray-900 mb-12 text-center">Envíanos un mensaje</h1>
          <div className="w-24 h-1 bg-black mb-8 mx-auto"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 outline-none transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 outline-none transition-colors duration-300"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 outline-none transition-colors duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-900 outline-none transition-colors duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-none hover:bg-gray-800 transition-colors duration-300"
            >
              <strong className="font-bold">Enviar Mensaje</strong>
            </button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Contacto;