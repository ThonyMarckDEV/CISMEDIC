import { useState, useEffect } from "react";
import { User, Award, BookOpen, Building, Globe, Clock, Upload, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PerfilDoctorComponent = () => {
  const [perfil, setPerfil] = useState({
    anos_experiencia: "",
    formacion: "",
    especialidades: "",
    lugares_trabajo: "",
    logros: "",
    idiomas: "",
    horario_atencion: "",
    foto_perfil: "",
    tarifa_consulta: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener los datos del perfil
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="h-8 w-8 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">Perfil Profesional</h1>
        <Button
          onClick={() => setEditing(!editing)}
          variant="outline"
          className="border-green-700 text-green-700 hover:bg-green-50"
        >
          {editing ? "Cancelar" : "Editar Perfil"}
        </Button>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-700">
          <AlertDescription className="text-green-700">
            Perfil actualizado exitosamente
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {perfil.foto_perfil ? (
                  <img
                    src={perfil.foto_perfil}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-20 w-20 text-gray-400" />
                )}
              </div>
              {editing && (
                <Button className="w-full mt-4 bg-green-700 hover:bg-green-800">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Foto
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="md:w-2/3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Años de Experiencia</label>
                  <div className="flex items-center mt-1">
                    <Award className="h-5 w-5 text-green-700 mr-2" />
                    <Input
                      name="anos_experiencia"
                      value={perfil.anos_experiencia}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="border-green-700 focus:ring-green-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tarifa por Consulta</label>
                  <Input
                    name="tarifa_consulta"
                    value={perfil.tarifa_consulta}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="border-green-700 focus:ring-green-700"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Formación Académica</label>
                <div className="flex items-start mt-1">
                  <BookOpen className="h-5 w-5 text-green-700 mr-2 mt-2" />
                  <Textarea
                    name="formacion"
                    value={perfil.formacion}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="border-green-700 focus:ring-green-700"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Especialidades</label>
                <Textarea
                  name="especialidades"
                  value={perfil.especialidades}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="border-green-700 focus:ring-green-700"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Lugares de Trabajo</label>
                <div className="flex items-start mt-1">
                  <Building className="h-5 w-5 text-green-700 mr-2 mt-2" />
                  <Textarea
                    name="lugares_trabajo"
                    value={perfil.lugares_trabajo}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="border-green-700 focus:ring-green-700"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Idiomas</label>
                  <div className="flex items-center mt-1">
                    <Globe className="h-5 w-5 text-green-700 mr-2" />
                    <Input
                      name="idiomas"
                      value={perfil.idiomas}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="border-green-700 focus:ring-green-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Horario de Atención</label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-5 w-5 text-green-700 mr-2" />
                    <Input
                      name="horario_atencion"
                      value={perfil.horario_atencion}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="border-green-700 focus:ring-green-700"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilDoctorComponent;