import { createContext, useContext, useState, useEffect } from 'react';
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de importar jwtUtils correctamente
import API_BASE_URL from '../js/urlHelper'; // Importa la URL base del backend

const CitasContext = createContext();

export const CitasProvider = ({ children }) => {
  const [cantidadCitas, setCantidadCitas] = useState(0);

  // Simular la carga de citas desde una API
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = jwtUtils.getTokenFromCookie(); // Obtener el token JWT desde las cookies
        if (!token) {
          console.error('No se encontró un token JWT.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/citas/cantidad`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Agregar el token al encabezado Authorization
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setCantidadCitas(data.cantidad);
      } catch (error) {
        console.error('Error al obtener la cantidad de citas:', error);
      }
    };

    fetchCitas();
  }, []);

  return (
    <CitasContext.Provider value={{ cantidadCitas }}>
      {children}
    </CitasContext.Provider>
  );
};

export const useCitas = () => useContext(CitasContext);