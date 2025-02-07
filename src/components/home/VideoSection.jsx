import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import video from '../../img/introcismedic.mp4';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Iniciamos muteado para permitir autoplay
  const videoRef = useRef(null);

  // Efecto para asegurar la reproducción automática
  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log("Autoplay prevented:", error);
        }
      };
      
      playVideo();
    }
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolume = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-green-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-green-700 text-4xl font-bold mb-4 animate-fade-in">
            ¡Descubre la Excelencia en Salud!
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto font-medium">
            Transformamos vidas con atención médica de primera clase y tecnología de vanguardia
          </p>
          <p className="text-green-600 text-lg mt-2 font-semibold">
            Tu bienestar es nuestra prioridad
          </p>
        </div>
        
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          {/* Video Container */}
          <div className="aspect-w-16 aspect-h-9">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              autoPlay
              playsInline
              muted={isMuted}
              preload="auto"
            >
              <source src={video} type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-green-400 transition-colors"
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
              >
                {isPlaying ? (
                  <PauseCircle className="w-8 h-8" />
                ) : (
                  <PlayCircle className="w-8 h-8" />
                )}
              </button>
              
              <button
                onClick={handleVolume}
                className="text-white hover:text-green-400 transition-colors"
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;