"use client";
import { useEffect, useState } from "react";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import Sidebar from "../../components/clienteComponents/SidebarCliente";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import NextAppointmentCard from './NextAppointmentCard';
import WelcomeHeader from '../../components/WelcomeHeader';

const Cliente = () => {

  return (
    <Sidebar>
      <div className="flex flex-col p-6 gap-6 md:-ml-64"> {/* Margen negativo solo en desktop */}

        <WelcomeHeader 
          customMessage=" Estamos aquí para cuidarte."
        />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Una columna en móvil, dos en desktop */}
          {/* Sección de citas */}
          <div className="rounded-lg shadow-md bg-white p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700">¿Te gustaría agendar una cita?</p>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none">
                <Link to="/cliente/nuevacita">Agendar una cita</Link> {/* Usa Link para la navegación */}
              </button>
            </div>
          </div>
         
          {/* Sección de resultados */}
          <div className="rounded-lg shadow-md bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Mis resultados</h2>
            <Link to="/cliente/resultadoslaboratorio" className="w-full"> {/* Envuelve el botón con Link */}
              <button className="w-full flex justify-between items-center px-4 py-2 rounded-md font-normal text-left hover:bg-green-100 focus:outline-none">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-5 w-5 text-green-700" />
                  </div>
                  <span>Resultados de Laboratorio</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
          
        
            <NextAppointmentCard />
   
        </div>
      </div>
    </Sidebar>
  )
}
export default Cliente;