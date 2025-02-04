import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import LoadingScreen from '../components/home/LoadingScreen';
import verificarCorreo from '../img/verificar_correo.png';
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
          // Verificar el token de la URL
          const verifyResponse = await fetch(`${API_BASE_URL}/api/verificar-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '', // Enviar el token si está presente
            },
            body: JSON.stringify({ token_veririficador }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResponse.ok && verifyResult.success) {
            SweetAlert.showMessageAlert('Éxito', 'Correo verificado exitosamente. Redirigiendo...', 'success');

            // Redirigir después de un pequeño retraso
            setTimeout(() => navigate('/'), 1500);
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
    <div className="bg-white text-gray-800 min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-center text-2xl font-bold p-4">Verificar Correo</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <img
              src={verificarCorreo}
              alt="Correo no verificado"
              className="w-80 h-80 mb-6 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default VerificarCorreo;
