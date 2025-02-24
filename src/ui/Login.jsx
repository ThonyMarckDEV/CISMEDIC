//login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../components/home/LoadingScreen';
import jwtUtils from '../utilities/jwtUtils';
import { Phone, ChevronLeft } from 'lucide-react';
import { useSnackbar } from 'notistack'; // Importa useSnackbar

const Login = ({ closeLoginModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); // Usa useSnackbar para mostrar notificaciones

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIsAccountDeleted(false);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': navigator.userAgent,
        },
        body: JSON.stringify({
          correo: email,
          password,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const token = result.token;
        const sessionId = result.sessionId;
        // Guardar el token en una cookie
        document.cookie = `jwt=${token}; path=/`;
        jwtUtils.setSessionCookie(sessionId);
  
        const userRole = jwtUtils.getUserRole(token);
        const userName = jwtUtils.getNombres(token);
  
        // Mostrar notificación de bienvenida
        enqueueSnackbar(`¡Bienvenido, ${userName}!`, {
          variant: 'success',
          autoHideDuration: 3000, // Duración de la notificación
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
  
        // Retrasar la redirección para que la notificación se muestre
        setTimeout(() => {
          if (userRole === 'superadmin') {
            window.location.href = '/superAdmin';
          } else if (userRole === 'admin') {
            window.location.href = '/admin';
          } else if (userRole === 'doctor') {
            window.location.href = '/doctor';
          } else if (userRole === 'cliente') {
            window.location.href = '/cliente';
          } else {
            console.error('Rol no reconocido:', userRole);
          }
        }, 3000); // Retraso de 3 segundos para que la notificación se muestre
      } else {
        // Manejar caso de cuenta eliminada
        if (response.status === 403 && result.accountDeleted) {
          setIsAccountDeleted(true);
          setError(result.error);
        }
        // Otros casos de error
        else if (response.status === 403) {
          setError(result.error || 'Su cuenta está inactiva. Por favor, contacte al administrador del sistema.');
        } else {
          setError(result.error || 'Hubo un error al iniciar sesión.');
        }
      }
    } catch (error) {
      setError('Error en la conexión con el servidor.');
      console.error('Error al intentar iniciar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden md:flex w-1/2 bg-green-700 p-8 flex-col">
        <div className="text-white text-2xl font-bold mb-20 text-center">Cismedic</div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="relative w-40 h-40 mb-8">
            <Phone className="w-full h-full text-white" />
          </div>
          <h1 className="text-white text-4xl font-medium text-center max-w-md">
            Agenda tus citas médicas virtuales y/o presenciales de la manera{' '}
            <span className="text-[#FFEB3B]">más simple y rápida</span>
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:w-1/2 bg-white">
        {loading && <LoadingScreen />}

        <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-10 w-full max-w-md animate-fade-in-down">
          <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver
          </a>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="animate-fade-in">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                         bg-white backdrop-blur-sm"
              />
            </div>

            <div className="relative animate-fade-in">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu contraseña"
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                         bg-white backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-12 right-4 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="/solicitar-restablecer-password"
                className="text-sm text-green-700 hover:text-green-800 hover:underline"
              >
                ¿Has olvidado tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg 
                       hover:bg-green-800 focus:outline-none focus:ring-2 
                       focus:ring-black transition-all animate-fade-in"
            >
              Iniciar sesión
            </button>

            {isAccountDeleted && (
              <button
                type="button"
                onClick={handleRegister}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg 
                         hover:bg-green-700 focus:outline-none focus:ring-2 
                         focus:ring-black transition-all animate-fade-in"
              >
                Registrarse nuevamente
              </button>
            )}
          </form>

          {error && (
            <p className="mt-4 text-center text-red-500 animate-fade-in bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;