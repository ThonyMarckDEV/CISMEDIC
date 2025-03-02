import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import API_BASE_URL from '../js/urlHelper';

const AlbumDoctor = ({ idDoctor }) => {
    const [fotos, setFotos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tieneAlbum, setTieneAlbum] = useState(false);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);

    const cargarAlbum = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/${idDoctor}/verificaralbum`);
            
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const data = await response.json();
            setTieneAlbum(data.existe);
            if(data.existe) cargarFotos();
        } catch (error) {
            console.error('Error cargando álbum:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarFotos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/doctor/${idDoctor}/album/fotos`);
            
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const data = await response.json();
            setFotos(data);
        } catch (error) {
            console.error('Error cargando fotos:', error);
        }
    };

    const nextSlide = () => {
        if (fotos.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % fotos.length);
    };

    const prevSlide = () => {
        if (fotos.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + fotos.length) % fotos.length);
    };

    useEffect(() => { 
        cargarAlbum(); 
    }, []);

    if (!tieneAlbum) return <div className="text-center py-4"></div>;

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-800">
                    <Edit className="inline mr-2" /> Álbum Médico
                </h2>
            </div>

            {fotos.length === 0 ? (
                <div className="h-96 rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                    <div className="text-center py-8 text-gray-500">
                        El álbum está vacío
                    </div>
                </div>
            ) : (
                <div className="relative h-64 rounded-lg overflow-hidden shadow-md" ref={carouselRef}>
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
                            </div>
                        ))}
                    </div>

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
                </div>
            )}
        </div>
    );
};

export default AlbumDoctor;