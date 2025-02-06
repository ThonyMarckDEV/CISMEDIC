import { createContext, useContext, useState, useEffect } from 'react';
import jwtUtils from '../utilities/jwtUtils';
import API_BASE_URL from '../js/urlHelper';

const CitasContextDoctor = createContext();

export const CitasProviderDoctor = ({ children }) => {
  const [cantidadCitas, setCantidadCitas] = useState(0);
  const token = jwtUtils.getTokenFromCookie();
  const userId = jwtUtils.getIdUsuario(token);

  // Función para obtener la cantidad de citas
  const fetchCitas = async () => {
    try {
      const token = jwtUtils.getTokenFromCookie();
      if (!token) {
        console.error('No se encontró un token JWT.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/doctor/citas/cantidad/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCantidadCitas(data.cantidad); // Actualizar el estado con la cantidad de citas
    } catch (error) {
      console.error('Error al obtener la cantidad de citas:', error);
    }
  };

  // Cargar las citas al montar el componente
  useEffect(() => {
    fetchCitas();
  }, []);

  return (
    <CitasContextDoctor.Provider value={{ cantidadCitas, setCantidadCitas }}>
      {children}
    </CitasContextDoctor.Provider>
  );
};

export const useCitas = () => useContext(CitasContextDoctor);