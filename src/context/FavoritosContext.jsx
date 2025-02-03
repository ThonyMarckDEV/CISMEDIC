// FavoritosContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  // Recuperar favoritos del localStorage al cargar el componente
  useEffect(() => {
    const favoritosGuardados = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(favoritosGuardados);
  }, []);

  // Actualizar localStorage cuando cambian los favoritos
  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const agregarFavorito = (nombreProducto) => {
    if (!favoritos.includes(nombreProducto)) {
      setFavoritos([...favoritos, nombreProducto]);
    }
  };

  const eliminarFavorito = (nombreProducto) => {
    const nuevosFavoritos = favoritos.filter((nombre) => nombre !== nombreProducto);
    setFavoritos(nuevosFavoritos);
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, agregarFavorito, eliminarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);