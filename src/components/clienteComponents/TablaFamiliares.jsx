import { Edit2, Trash2 } from "lucide-react"

const TablaFamiliares = ({ familiares, handleEdit, handleDelete }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familiares.map((familiar) => (
          <div
            key={familiar.idFamiliarUsuario}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {familiar.nombre} {familiar.apellidos}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">DNI:</span> {familiar.dni}
                </p>
                <p>
                  <span className="font-medium">Edad:</span> {familiar.edad}
                </p>
                <p>
                  <span className="font-medium">Sexo:</span> {familiar.sexo}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(familiar)}
                className="text-green-600 hover:text-green-800 transition-colors duration-300"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(familiar.idFamiliarUsuario)}
                className="text-red-600 hover:text-red-800 transition-colors duration-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TablaFamiliares

