import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Filtrador = ({ categorias = [] }) => {
  const [categoria, setCategoria] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si la sidebar está abierta o cerrada
  const inputRef = useRef(null); // Referencia para el input
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar los valores iniciales desde la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const nombreParam = queryParams.get('nombre');
    const categoriaParam = queryParams.get('categoria');

    if (nombreParam && inputRef.current) {
      inputRef.current.value = nombreParam; // Establecer el valor inicial del input
    }
    if (categoriaParam) setCategoria(categoriaParam);
  }, [location.search]);

  // Aplicar filtros
  const handleApplyFilter = () => {
    const nombre = inputRef.current ? inputRef.current.value : ''; // Obtener el valor del input
    const params = new URLSearchParams();
    if (nombre) params.set('nombre', nombre);
    if (categoria) params.set('categoria', categoria);
    navigate(`/catalogo?${params.toString()}`);
    setIsOpen(false);
  };

  // Reiniciar filtros
  const handleResetFilter = () => {
    if (inputRef.current) inputRef.current.value = ''; // Limpiar el input
    setCategoria('');
    navigate('/catalogo');
    setIsOpen(false);
  };

  // Abrir/cerrar el filtrador
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar el filtrador con la tecla Escape
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Contenido del filtrador
  const FilterContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
          <button
            onClick={toggleFilter}
            className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Filtro por nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto
            </label>
            <input
              ref={inputRef} // Referencia para el input
              type="text"
              defaultValue={new URLSearchParams(location.search).get('nombre') || ''} // Valor inicial
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Buscar por nombre"
              autoComplete="off"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">Todas las categorías</option>
              {Array.isArray(categorias) && categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.nombreCategoria}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleApplyFilter}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={handleResetFilter}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para desktop */}
      <aside
        className={`fixed top-32 h-[calc(100vh-8rem)] w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <FilterContent />
        {/* Botón para abrir/cerrar en desktop */}
        <button
          onClick={toggleFilter}
          className={`absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-r-lg transition-colors ${
            !isOpen ? 'animate-slide-right-back' : '' // Aplicar animación solo si la sidebar está cerrada
          }`}
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </aside>
    </>
  );
};

export default Filtrador;