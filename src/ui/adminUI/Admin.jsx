"use client"
import { useEffect, useState } from "react"
import { NotebookTextIcon, FileText, ChevronRight , UserPenIcon } from "lucide-react"
import SidebarAdmin from "../../components/adminComponents/SidebarAdmin"
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import WelcomeHeader from '../../components/WelcomeHeader';

const Admin = () => {

  return (
    <SidebarAdmin>
      <div className="flex flex-col p-6 gap-6 md:-ml-64"> {/* Margen negativo solo en desktop */}
                

      <WelcomeHeader 
          customMessage="Administra la clinica, confiamos en ti."
        />
        
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Una columna en móvil, dos en desktop */}

          {/* Sección de citas */}
          <div className="rounded-lg shadow-md bg-white p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                <NotebookTextIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700">¿Te gustaría subir los resultados de un paciente?</p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none">
                <Link to="/admin/subirresultados">Subir resultados</Link> {/* Usa Link para la navegación */}
              </button>
            </div>
          </div>

             {/* Sección de citas */}
             <div className="rounded-lg shadow-md bg-white p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                <UserPenIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700">¿Te gustaría agendar una cita a un cliente?</p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none">
                <Link to="/admin/agendarcitacliente">Agendar Cita</Link> {/* Usa Link para la navegación */}
              </button>
            </div>
          </div>

        </div>
      </div>
    </SidebarAdmin>
  )
}

export default Admin