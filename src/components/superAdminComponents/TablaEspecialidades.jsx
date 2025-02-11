import React, { useState } from 'react';
import { Pencil, Trash2, X, Search } from 'lucide-react';

const TablaEspecialidades = ({ especialidades, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const cardsPerPage = 6;

  // Filtrar especialidades basadas en el término de búsqueda
  const filteredEspecialidades = especialidades.filter(especialidad => {
    const searchLower = searchTerm.toLowerCase();
    return (
      especialidad.nombre?.toLowerCase().includes(searchLower) ||
      especialidad.descripcion?.toLowerCase().includes(searchLower)
    );
  });

  // Calcular paginación
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentEspecialidades = filteredEspecialidades.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredEspecialidades.length / cardsPerPage);

  // Resetear a la primera página cuando cambia el término de búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Especialidades Registradas</h2>
        {onEdit.isEditing && (
          <button
            onClick={() => onEdit.cancelEdit()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Mostrar mensaje si no hay resultados */}
      {filteredEspecialidades.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron especialidades que coincidan con la búsqueda
        </div>
      ) : (
        <>
          {/* Lista de especialidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentEspecialidades.map((especialidad) => (
              <div key={especialidad.idEspecialidad} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{especialidad.nombre}</h3>
                      <p className="text-sm text-gray-600">{especialidad.descripcion}</p>
                    </div>
                    <span className="text-2xl">
                      {especialidad.icono} {/* Mostrar el emoji como icono */}
                    </span>
                  </div>

                  {/* Botones de editar y eliminar */}
                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                      onClick={() => onEdit(especialidad)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(especialidad.idEspecialidad)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TablaEspecialidades;