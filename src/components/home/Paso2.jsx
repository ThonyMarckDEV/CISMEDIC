import React, { useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';

const Paso2 = ({ onNext }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/registrar-usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombres, apellidos, telefono, departamento }),
      });
      const data = await response.json();
      if (response.ok) {
        onNext();
      } else {
        setError(data.message || 'Error al registrar los datos');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-2xl font-medium mb-8">Ingresa tus datos personales</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nombres</label>
          <input
            placeholder="Ej: Juan"
            className="w-full p-2 border rounded-md text-sm"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Apellidos</label>
          <input
            placeholder="Ej: Pérez"
            className="w-full p-2 border rounded-md text-sm"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
          <input
            placeholder="Ej: 987654321"
            className="w-full p-2 border rounded-md text-sm"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Departamento</label>
          <input
            placeholder="Ej: Lima"
            className="w-full p-2 border rounded-md text-sm"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-black text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default Paso2;