import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import LoadingScreen from '../../components/home/LoadingScreen';
import logoCismedic from '../../img/logo.png';
import SweetAlert from '../../components/SweetAlert';
import API_BASE_URL from '../../js/urlHelper';

const RestablecerContraseña = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (pass) => {
    const errors = {};
    if (pass.length < 8) {
      errors.length = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(pass)) {
      errors.uppercase = 'La contraseña debe contener al menos una mayúscula.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      errors.symbol = 'La contraseña debe contener al menos un símbolo.';
    }
    return errors;
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password requirements
    const validationErrors = validatePassword(password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ ...errors, match: 'Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    const token_veririficador = searchParams.get('token_veririficador');

    try {
      const response = await fetch(`${API_BASE_URL}/api/restablecer-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_veririficador,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        SweetAlert.showMessageAlert(
          'Éxito',
          'Contraseña actualizada correctamente.',
          'success'
        );
        setTimeout(() => navigate('/login'), 2000);
      } else {
        if (response.status === 422 && data.errors) {
          setErrors(data.errors);
        } else {
          SweetAlert.showMessageAlert('Error', data.message, 'error');
        }
      }
    } catch (error) {
      SweetAlert.showMessageAlert('Error', 'Error al restablecer la contraseña.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verificarToken = async () => {
      const token_veririficador = searchParams.get('token_veririficador');

      if (!token_veririficador) {
        SweetAlert.showMessageAlert('Error', 'Token no proporcionado.', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/verificar-token-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_veririficador }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setTokenValido(true);
        } else {
          SweetAlert.showMessageAlert('Error', 'Token inválido o expirado.', 'error');
        }
      } catch (error) {
        SweetAlert.showMessageAlert('Error', 'Error al verificar el token.', 'error');
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, [searchParams]);

 

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Previous code remains the same */}
      <div className="z-10 flex flex-col items-center px-4 w-full max-w-md">
        <img src={logoCismedic} alt="Cismedic Logo" className="w-48 mb-8" />

        {tokenValido ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full animate-fade-in-up">
            <a href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver al inicio de sesión
            </a>

            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Crear Nueva Contraseña
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`w-full p-3 border ${
                    Object.keys(errors).length > 0 ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10"
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>

              {/* Password requirements and error messages */}
              <div className="text-sm space-y-1">
                {Object.values(errors).map((error, index) => (
                  <p key={index} className="text-red-500">{error}</p>
                ))}
                <ul className="text-gray-600 list-disc pl-5 mt-2">
                  <li>Mínimo 8 caracteres</li>
                  <li>Al menos una letra mayúscula</li>
                  <li>Al menos un símbolo (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                </ul>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full p-3 border ${
                    errors.match ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10"
                >
                  {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors duration-200"
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
        ) : (
          /* Previous invalid token message remains the same */
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full text-center">
            <h2 className="text-xl text-red-600 mb-4">Token inválido o expirado</h2>
            <p className="text-gray-600 mb-4">
              El enlace que estás utilizando no es válido o ha expirado.
              Por favor, solicita un nuevo enlace para restablecer tu contraseña.
            </p>
            <a
              href="/solicitar-restablecer-password"
              className="inline-block bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors duration-200"
            >
              Solicitar nuevo enlace
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestablecerContraseña;