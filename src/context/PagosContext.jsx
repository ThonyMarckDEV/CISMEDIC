import { createContext, useContext, useState, useEffect } from 'react';
import jwtUtils from '../utilities/jwtUtils'; // Asegúrate de importar jwtUtils correctamente
import API_BASE_URL from '../js/urlHelper'; // Importa la URL base del backend

const PagosContext = createContext();

export const PagosProvider = ({ children }) => {
  const [cantidadPagos, setCantidadPagos] = useState(0);

  // Simular la carga de pagos desde una API
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = jwtUtils.getTokenFromCookie(); // Obtener el token JWT desde las cookies
        if (!token) {
          console.error('No se encontró un token JWT.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/pagos/cantidad`, {
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
        setCantidadPagos(data.cantidad);
      } catch (error) {
        console.error('Error al obtener la cantidad de pagos:', error);
      }
    };

    fetchPagos();
  }, []);

  return (
    <PagosContext.Provider value={{ cantidadPagos }}>
      {children}
    </PagosContext.Provider>
  );
};

export const usePagos = () => useContext(PagosContext);