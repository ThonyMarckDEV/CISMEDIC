import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import LoadingScreen from '../../components/home/LoadingScreen';
import logoCismedic from '../../img/logo.png';
import SweetAlert from '../../components/SweetAlert';
import API_BASE_URL from '../../js/urlHelper';

const SolicitarRestablecerContraseña = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/solicitar-restablecer-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (response.ok) {
        SweetAlert.showMessageAlert(
          'Éxito',
          'Se ha enviado un enlace a tu correo para restablecer tu contraseña.',
          'success'
        );
        setEmail('');
      } else {
        SweetAlert.showMessageAlert(
          'Error',
          data.message || 'Error al procesar la solicitud.',
          'error'
        );
      }
    } catch (error) {
      SweetAlert.showMessageAlert(
        'Error',
        'Error al conectar con el servidor.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col items-center justify-center relative overflow-hidden">
      {loading && <LoadingScreen />}

      {/* Olas decorativas */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
        <div className="absolute bottom-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-green-600">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="z-10 flex flex-col items-center px-4 w-full max-w-md">
        {/* Logo */}
        <img src={logoCismedic} alt="Cismedic Logo" className="w-48 mb-8" />

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full animate-fade-in-up">
          <a href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver al inicio de sesión
          </a>

          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Restablecer Contraseña
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors duration-200"
            >
              Enviar enlace de restablecimiento
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarRestablecerContraseña;