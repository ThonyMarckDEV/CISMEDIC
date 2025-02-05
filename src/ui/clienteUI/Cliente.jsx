"use client"
import { useEffect, useState } from "react"
import { Calendar, FileText, ChevronRight } from "lucide-react"
import Sidebar from "../../components/clienteComponents/SidebarCliente"
import jwtUtils from "../../utilities/jwtUtils"
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom

const Cliente = () => {
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
    <Sidebar>
      <div className="flex flex-col p-6 gap-6 md:-ml-64"> {/* Margen negativo solo en desktop */}
                
           {/* Header */}
           <div className="mb-8 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-3xl shadow-lg overflow-hidden">
            <div className="px-8 py-12 relative">
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Bienvenido, {nombreUsuario || "Usuario"}
                </h1>
                <p className="text-violet-100 text-lg">
                 Estamos aquí para cuidarte.
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

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Una columna en móvil, dos en desktop */}

          {/* Sección de citas */}
          <div className="rounded-lg shadow-md bg-white p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-[#E8F7FC]">
                <Calendar className="h-8 w-8 text-[#00A3D7]" />
              </div>
              <h2 className="text-xl font-semibold">Todavía no tienes citas.</h2>
              <p className="text-gray-500">¿Te gustaría agendar una?</p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium bg-[#00A3D7] text-white hover:bg-[#0090BE] focus:outline-none">
                <Link to="/cliente/nuevacita">Agendar una cita</Link> {/* Usa Link para la navegación */}
              </button>
            </div>
          </div>

         
          {/* Sección de resultados */}
          <div className="rounded-lg shadow-md bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Mis resultados</h2>
            <Link to="/cliente/resultadoslaboratorio" className="w-full"> {/* Envuelve el botón con Link */}
              <button className="w-full flex justify-between items-center px-4 py-2 rounded-md font-normal text-left hover:bg-[#E8F7FC] focus:outline-none">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#E8F7FC]">
                    <FileText className="h-5 w-5 text-[#00A3D7]" />
                  </div>
                  <span>Resultados de Laboratorio</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </Sidebar>
  )
}

export default Cliente