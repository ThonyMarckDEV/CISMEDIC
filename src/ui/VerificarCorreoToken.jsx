import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import LoadingScreen from '../components/home/LoadingScreen';
import verificarCorreo from '../img/verificar_correo.png';
import logoCismedic from '../img/logo.png';
import jwtUtils from '../utilities/jwtUtils';
import { verificarYRenovarToken } from '../js/authToken';
import SweetAlert from '../components/SweetAlert';

const VerificarCorreo = () => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      const token_veririficador = searchParams.get('token_veririficador');
      const token = jwtUtils.getTokenFromCookie();

      if (token_veririficador) {
        await verificarYRenovarToken();
        try {
          const verifyResponse = await fetch(`${API_BASE_URL}/api/verificar-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ token_veririficador }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResponse.ok && verifyResult.success) {
            SweetAlert.showMessageAlert('Éxito', 'Correo verificado exitosamente. Redirigiendo...', 'success');
            setTimeout(() => navigate('/'), 3000);
          } else {
            SweetAlert.showMessageAlert('Error', 'Error verificando el correo.', 'error');
          }
        } catch (error) {
          console.error('Error al verificar el correo:', error);
          SweetAlert.showMessageAlert('Error', 'Error al comunicarse con el servidor.', 'error');
        }
      } else {
        SweetAlert.showMessageAlert('Error', 'Token no proporcionado en la URL.', 'error');
      }

      setLoading(false);
    };

    verifyAndRefreshToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Olas decorativas */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
        <div className="absolute bottom-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-green-600">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-green-500 opacity-50">
            <path fill="currentColor" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,128C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="z-10 flex flex-col items-center px-4 animate-fade-in">
        {/* Logo */}
        <img 
          src={logoCismedic} 
          alt="Cismedic Logo" 
          className="w-48 mb-8 animate-bounce-slow"
        />

        {loading ? (
          <LoadingScreen />
        ) : (
          <div className="text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto mb-8 animate-fade-in-up">
              <img
                src={verificarCorreo}
                alt="Verificación de correo"
                className="w-48 h-48 mx-auto mb-6 animate-pulse-slow"
              />
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                Verificación de Correo
              </h2>
              <p className="text-gray-600 mb-6">
                Estamos procesando la verificación de tu correo electrónico. 
                Por favor, espera un momento.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificarCorreo;