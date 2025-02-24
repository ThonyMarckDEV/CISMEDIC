import { createContext, useContext, useState, useEffect } from 'react';
import jwtUtils from '../utilities/jwtUtils';
import API_BASE_URL from '../js/urlHelper';

const PagosContext = createContext();

export const PagosProvider = ({ children }) => {
  const [cantidadPagos, setCantidadPagos] = useState(0);

  // Función para obtener la cantidad de pagos
  const fetchPagos = async () => {
    try {
      const token = jwtUtils.getTokenFromCookie();
      const idCliente = jwtUtils.getIdUsuario(token);

      if (!token) {
        console.error('No se encontró un token JWT.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/cliente/pagos/cantidad/${idCliente}`, {
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
      setCantidadPagos(data.cantidad);
    } catch (error) {
      console.error('Error al obtener la cantidad de pagos:', error);
    }
  };

  // Cargar los pagos al montar el componente
  useEffect(() => {
    fetchPagos();
  }, []);

  return (
    <PagosContext.Provider value={{ cantidadPagos, setCantidadPagos }}>
      {children}
    </PagosContext.Provider>
  );
};

export const usePagos = () => useContext(PagosContext);