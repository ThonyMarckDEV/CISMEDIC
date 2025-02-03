import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../components/home/LoadingScreen';
import jwtUtils from '../utilities/jwtUtils';
import { updateLastActivity } from '../js/lastActivity';

const Login = ({ closeLoginModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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

        // Crear una cookie de sesión
        document.cookie = `jwt=${token}; path=/`;
        
        // Función para actualizar la actividad
        updateLastActivity();
    
        // Decodificar el JWT para obtener el rol
        const userRole = jwtUtils.getUserRole(token);
    
        // Redirigir según el rol
        if (userRole === 'superadmin') {
            window.location.href = '/superAdmin/dashboard';
        } else if (userRole === 'admin') {
            window.location.href = '/admin/productos/agregar';
        } else {
            console.error('Rol no reconocido:', userRole);
        }
      } else {
        // Mostrar mensaje de error específico para usuario inactivo
        if (response.status === 403) {
          setError('Su cuenta está inactiva. Por favor, contacte al administrador del sistema.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 flex items-center justify-center">

        {loading && <LoadingScreen />}

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 sm:p-10 w-full max-w-md animate-fade-in-down">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-600 mb-2">RCI</h1>
          <h2 className="text-xl text-gray-700">Panel Administrador</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <h3 className="text-xl font-medium text-center text-gray-800 mb-6 animate-fade-in">
          ¡Bienvenido de nuevo!
        </h3>

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
              className="mt-1 block w-full p-3 border border-yellow-200 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                       bg-white/50 backdrop-blur-sm"
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
              className="mt-1 block w-full p-3 border border-yellow-200 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                       bg-white/50 backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-12 right-4 transform -translate-y-1/2 text-gray-600 hover:text-yellow-600"
            >
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 rounded-lg 
                     hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 
                     focus:ring-yellow-400 transition-all animate-fade-in"
          >
            Iniciar sesión
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-500 animate-fade-in bg-red-100 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="mt-6 animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;