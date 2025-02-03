import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';

const Paso1 = ({ onNext }) => {
  const [dni, setDni] = useState('');
  const [nacimiento, setNacimiento] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/verificar-dni`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, nacimiento }),
      });
      const data = await response.json();
      if (response.ok) {
        onNext();
      } else {
        setError(data.message || 'Error al verificar el DNI');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver
      </a>

      <h2 className="text-2xl font-medium mb-8">Ingresa tu documento</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tipo de documento</label>
            <select className="w-full p-2 border rounded-md text-sm">
              <option>DNI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">N° de documento</label>
            <input
              placeholder="Ej: 11122233"
              className="w-full p-2 border rounded-md text-sm"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md text-sm"
            value={nacimiento}
            onChange={(e) => setNacimiento(e.target.value)}
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

export default Paso1;