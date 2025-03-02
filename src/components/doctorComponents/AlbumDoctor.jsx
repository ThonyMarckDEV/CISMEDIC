import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, X, ChevronLeft, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import sweetAlert from '../SweetAlert';

// Modified AlbumDoctor component with smaller size
const AlbumDoctor = () => {
    const [fotos, setFotos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [tieneAlbum, setTieneAlbum] = useState(false);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);
    const [enlace, setEnlace] = useState('');
    // Nuevo estado para el enlace  

    // Obtener token y ID
    const token = jwtUtils.getTokenFromCookie();
    const idUsuario = jwtUtils.getIdUsuario(token);

    // Función para crear headers con autenticación
    const createAuthHeaders = (contentType = 'application/json') => {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'idUsuario': idUsuario
        };
        
        if (contentType) {
            headers['Content-Type'] = contentType;
        }
        
        return headers;
    };

    // Función para cargar el enlace del álbum
    const cargarEnlace = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/album`, {
                method: 'GET',
                headers: createAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Error al obtener enlace');
            
            const data = await response.json();
            setEnlace(data.enlace || '');
        } catch (error) {
            console.error('Error cargando enlace:', error);
        }
    };

    // Modificar cargarAlbum para cargar el enlace
    const cargarAlbum = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/verificaralbum`, {
                method: 'GET',
                headers: createAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const data = await response.json();
            setTieneAlbum(data.existe);
            if(data.existe) {
                await cargarFotos();
                await cargarEnlace(); // Cargar enlace después de confirmar álbum
            }
        } catch (error) {
            sweetAlert.showMessageAlert('Error', 'Error cargando álbum', 'error');
            console.error('Error cargando álbum:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para guardar el enlace
    const guardarEnlace = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/album/actualizar`, {
                method: 'PUT',
                headers: createAuthHeaders(),
                body: JSON.stringify({ enlace })
            });
            
            if (!response.ok) throw new Error('Error actualizando enlace');
            
            sweetAlert.showMessageAlert('Éxito', 'Enlace actualizado', 'success');
        } catch (error) {
            sweetAlert.showMessageAlert('Error', error.message, 'error');
            console.error('Error guardando enlace:', error);
        }
    };

    // Cargar fotos
    const cargarFotos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/album/fotos`, {
                method: 'GET',
                headers: createAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const data = await response.json();
            setFotos(data);
        } catch (error) {
            sweetAlert.showMessageAlert('Error', error.message, 'error');
            console.error('Error cargando fotos:', error);
        }
    };

    // Crear álbum
    const crearAlbum = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/crearalbum`, {
                method: 'POST',
                headers: createAuthHeaders(),
                body: JSON.stringify({ idUsuario })
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            setTieneAlbum(true);
            sweetAlert.showMessageAlert('Éxito', 'Álbum creado', 'success');
        } catch (error) {
            sweetAlert.showMessageAlert('Error', error.message, 'error');
            console.error('Error creando álbum:', error);
        }
    };

    // Subir foto
    const subirFoto = async (file) => {
        const formData = new FormData();
        formData.append('foto', file);
        formData.append('idUsuario', idUsuario);

        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/foto`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // No incluimos Content-Type para que el navegador establezca el boundary correcto
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            cargarFotos();
            sweetAlert.showMessageAlert('Éxito', 'Foto subida', 'success');
        } catch (error) {
            sweetAlert.showMessageAlert('Error', error.message, 'error');
            console.error('Error subiendo foto:', error);
        }
    };

    // Eliminar foto
    const eliminarFoto = async (idFoto) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/foto/${idFoto}`, {
                method: 'DELETE',
                headers: createAuthHeaders(),
                body: JSON.stringify({ idUsuario })
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            setFotos(fotos.filter(foto => foto.idAlbumUsuario !== idFoto));
            sweetAlert.showMessageAlert('Éxito', 'Foto eliminada', 'success');
        } catch (error) {
            sweetAlert.showMessageAlert('Error', error.message, 'error');
            console.error('Error eliminando foto:', error);
        }
    };

    // Carousel navigation
    const nextSlide = () => {
        if (fotos.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % fotos.length);
    };

    const prevSlide = () => {
        if (fotos.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + fotos.length) % fotos.length);
    };

    useEffect(() => { 
        // Verificar si hay token antes de cargar
        if (!token) {
            sweetAlert.showMessageAlert('Error', 'No se ha iniciado sesión', 'error');
            setLoading(false);
            return;
        }
        cargarAlbum(); 
    }, []);

    if(loading) return <div className="text-center py-6">Cargando...</div>;

    // Si no hay token, mostrar mensaje
    if (!token) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-red-100">
                <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">Debe iniciar sesión para acceder al álbum médico</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-100">
            {/* Encabezado Corregido */}
            <div className="flex justify-between items-center mb-4">
                {/* Lado izquierdo - Título */}
                <h2 className="text-xl font-bold text-green-800">
                    <Edit className="inline mr-2" /> Álbum Médico
                </h2>

                {/* Lado derecho - Controles */}
                {tieneAlbum && (
                    <div className="flex items-center gap-4">
                        {/* Enlace y campo de edición */}
                        <div className="flex items-center gap-2">
                            {!editMode ? (
                                <span className="text-sm text-gray-600">
                                    Enlace: {enlace || 'Sin enlace'}
                                </span>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={enlace}
                                        onChange={(e) => setEnlace(e.target.value)}
                                        className="border rounded px-2 py-1 text-sm w-48"
                                        placeholder="Ingrese enlace"
                                    />
                                    <button
                                        onClick={guardarEnlace}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Botón de edición */}
                        <button 
                            onClick={() => setEditMode(!editMode)}
                            className={`px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-all ${
                                editMode 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-green-700 hover:bg-green-800 text-white'
                            }`}
                        >
                            {editMode ? <X size={16} /> : <Edit size={16} />}
                            {editMode ? 'Salir Edición' : 'Editar Álbum'}
                        </button>
                    </div>
                )}
            </div>

            {/* Contenido */}
            {!tieneAlbum ? (
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-3 text-sm">No tienes ningún álbum creado</p>
                    <button
                        onClick={crearAlbum}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 
                        flex items-center gap-1 mx-auto text-sm"
                    >
                        <Plus size={18} /> Crear Álbum
                    </button>
                </div>
            ) : (
                <>
                    {/* Carrusel más pequeño con Tailwind */}
                    {fotos.length > 0 ? (
                        <div className="relative h-64 rounded-lg overflow-hidden shadow-md" ref={carouselRef}>
                            {/* Slides */}
                            <div className="h-full relative overflow-hidden">
                                {fotos.map((foto, index) => (
                                    <div 
                                        key={foto.idAlbumUsuario} 
                                        className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out transform ${
                                            index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                                        }`}
                                    >
                                        <img
                                            src={`${API_BASE_URL}/${foto.ruta_imagen}`}
                                            className="object-contain h-full w-full"
                                            alt="Foto médica"
                                        />
                                        {editMode && (
                                            <button
                                                onClick={() => eliminarFoto(foto.idAlbumUsuario)}
                                                className="absolute top-2 right-2 bg-red-600 text-white 
                                                p-1 rounded-full hover:bg-red-700 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Controles de navegación */}
                            <button 
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 
                                    rounded-full p-1 shadow-lg z-10 focus:outline-none"
                                onClick={prevSlide}
                            >
                                <ChevronLeft size={20} className="text-green-800" />
                            </button>
                            <button 
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 
                                    rounded-full p-2 shadow-lg z-10 focus:outline-none"
                                onClick={nextSlide}
                            >
                                <ChevronRight size={24} className="text-green-800" />
                            </button>

                            {/* Indicadores */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {fotos.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 w-2 rounded-full transition-all ${
                                            index === currentIndex ? 'bg-green-600 w-4' : 'bg-white/60'
                                        }`}
                                        aria-label={`Ir a imagen ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Botón flotante subir */}
                            {editMode && (
                                <label className="absolute bottom-6 right-6 bg-green-700 text-white 
                                p-3 rounded-full hover:bg-green-800 cursor-pointer shadow-lg 
                                transition-all z-10">
                                    <Plus size={24} />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => subirFoto(e.target.files[0])}
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                    ) : (
                        <div className="h-96 rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                            <div className="text-center py-8 text-gray-500">
                                {editMode 
                                ? (
                                    <div className="flex flex-col items-center">
                                        <p className="mb-4">Sube tu primera foto usando el botón (+)</p>
                                        <label className="bg-green-700 text-white p-3 rounded-full 
                                        hover:bg-green-800 cursor-pointer shadow-lg transition-all">
                                            <Plus size={24} />
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => subirFoto(e.target.files[0])}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                )
                                : 'El álbum está vacío'}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AlbumDoctor;