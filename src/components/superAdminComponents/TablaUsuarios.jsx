import React, { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';

const TablaUsuarios = ({ users, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  
  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentUsers = users.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(users.length / cardsPerPage);

  const getUserRoleColor = (rol) => {
    switch (rol) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'doctor':
        return 'bg-blue-100 text-blue-700';
      case 'cliente':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Usuarios Registrados</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentUsers.map((user) => (
          <div key={user.idUsuario} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.correo}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUserRoleColor(user.rol)}`}>
                  {user.rol}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="font-medium">Nombres:</span> {user.nombres}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Apellidos:</span> {user.apellidos}
                </p>
                <p className="text-sm">
                  <span className="font-medium">DNI:</span> {user.dni}
                </p>
                {user.telefono && (
                  <p className="text-sm">
                    <span className="font-medium">Teléfono:</span> {user.telefono}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(user.idUsuario)}
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

      {/* Pagination */}
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
    </div>
  );
};

export default TablaUsuarios;