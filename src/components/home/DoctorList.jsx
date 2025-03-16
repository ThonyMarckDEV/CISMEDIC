import React from 'react';
import { WifiOff, Search } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import API_BASE_URL_PHOTO from '../../js/urlHelperPhoto';
import imgperfil from '../../img/defualtpefil.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorList = ({
  doctors,
  itemsPerPage = 6,
  currentPage,
  onPageChange,
  onDoctorDetails,
  isLoading,
  error,
}) => {
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDoctors = doctors?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((doctors?.length || 0) / itemsPerPage);

  // Handle error states
  if (error) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 border-l-4 border-red-500 bg-red-50 rounded-md">
        <div className="flex items-start">
          <WifiOff className="h-5 w-5 text-red-600 mr-4 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error de conexión</h3>
            <p className="mt-2 text-sm text-red-700">
              No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle no results state
  if (!isLoading && (!doctors || doctors.length === 0)) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <Search className="h-5 w-5 text-blue-600 mr-4 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-800">Sin resultados</h3>
            <p className="mt-2 text-sm text-blue-700">
              No se encontraron médicos que coincidan con los filtros seleccionados. Por favor, intenta con otros criterios de búsqueda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {paginatedDoctors.map((doctor) => (
            <motion.div
              key={doctor.idUsuario}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col items-center">
                <img
                  src={doctor.perfil ? `${API_BASE_URL_PHOTO}/backend/storage/app/public/${doctor.perfil}` : imgperfil}
                  alt={`Dr. ${doctor.nombres} ${doctor.apellidos}`}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <span className="text-sm text-gray-600 mb-2">{doctor.especialidad}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {`${doctor.nombres} ${doctor.apellidos}`}
                </h3>
                <button
                  onClick={() => onDoctorDetails(doctor.idUsuario)}
                  className="text-green-600 hover:text-green-700 transition-colors duration-300"
                >
                  Conoce más →
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                currentPage === index + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;