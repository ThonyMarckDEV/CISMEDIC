import React, { useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import SweetAlert from '../../components/SweetAlert';
import LoaderScreen from '../../components/home/LoadingScreen';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Paso2 = ({ onNext }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const dni = localStorage.getItem('dni');
    const nacimiento = localStorage.getItem('nacimiento');

    const data = {
      dni,
      nacimiento,
      nombres,
      apellidos,
      telefono,
      correo,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrar-usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.clear();
        setIsLoading(false);
        SweetAlert.showMessageAlert('Éxito', 'Usuario registrado Correctamente , Verifica tu Correo!.', 'success');
    
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setIsLoading(false);
        setErrors(result.errors || { general: result.message || 'Error al registrar los datos' });
      }
    } catch (err) {
      setIsLoading(false);
      SweetAlert.showMessageAlert(
        'Error',
        'Error de conexión. Por favor, inténtalo de nuevo.',
        'error'
      );
    }
  };

  return (
    <>
      {isLoading && <LoaderScreen />}
      <div className="max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-medium mb-8 text-green-700">Ingresa tus datos personales</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombres</label>
            <input
              placeholder="Ej: Juan"
              className={`w-full p-2 border rounded-md text-sm ${
                errors.nombres ? 'border-red-500' : ''
              }`}
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Apellidos</label>
            <input
              placeholder="Ej: Pérez"
              className={`w-full p-2 border rounded-md text-sm ${
                errors.apellidos ? 'border-red-500' : ''
              }`}
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
            <input
              placeholder="Ej: 987654321"
              className={`w-full p-2 border rounded-md text-sm ${
                errors.telefono ? 'border-red-500' : ''
              }`}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Correo</label>
            <input
              type="email"
              placeholder="Ej: juan@example.com"
              className={`w-full p-2 border rounded-md text-sm ${
                errors.correo ? 'border-red-500' : ''
              }`}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ej: Password123!"
                className={`w-full p-2 border rounded-md text-sm ${
                  errors.password ? 'border-red-500' : ''
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                className={`w-full p-2 border rounded-md text-sm ${
                  errors.password_confirmation ? 'border-red-500' : ''
                }`}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm">{errors.general}</p>
          )}

          <button
            type="submit"
            className="w-full p-3 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            Continuar
          </button>
        </form>
      </div>
    </>
  );
};

export default Paso2;