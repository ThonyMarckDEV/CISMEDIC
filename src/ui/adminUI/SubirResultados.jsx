"use client"
import { useEffect, useState } from "react"
import { NotebookTextIcon, FileText, ChevronRight } from "lucide-react"
import SidebarAdmin from "../../components/adminComponents/SidebarAdmin"
import jwtUtils from "../../utilities/jwtUtils"
import ResultsForm from "../../components/adminComponents/PatientResultsForm" // Importamos el componente del formulario

const SubirResultados = () => {
  const [nombreUsuario, setNombreUsuario] = useState("")
  
  useEffect(() => {
    const token = jwtUtils.getTokenFromCookie()
    if (token) {
      const nombre = jwtUtils.getNombres(token)
      if (nombre) {
        setNombreUsuario(nombre)
      }
    }
  }, [])

  return (
    <SidebarAdmin>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-green-900 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-12 relative">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bienvenido, {nombreUsuario || "Usuario"}
              </h1>
              <p className="text-violet-100 text-lg">
                Sube los resultados de un Paciente.
              </p>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 100 100" className="h-full">
                <circle cx="80" cy="20" r="15" fill="white"/>
                <circle cx="20" cy="80" r="25" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        <ResultsForm />
      </div>
    </SidebarAdmin>
  )
}

export default SubirResultados