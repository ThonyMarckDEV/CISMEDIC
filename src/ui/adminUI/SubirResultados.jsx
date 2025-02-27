"use client"
import SidebarAdmin from "../../components/adminComponents/SidebarAdmin"
import ResultsForm from "../../components/adminComponents/PatientResultsForm" // Importamos el componente del formulario
import WelcomeHeader from '../../components/WelcomeHeader';

const SubirResultados = () => {

  return (
    <SidebarAdmin>
      <div className="flex flex-col p-6 gap-6 md:-ml-64">

          <WelcomeHeader 
            customMessage="Sube los resultados de un Paciente."
          />

        <ResultsForm />
      </div>
    </SidebarAdmin>
  )
}

export default SubirResultados