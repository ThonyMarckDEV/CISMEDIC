import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import Paso1 from '../components/home/Paso1';
import Paso2 from '../components/home/Paso2';

export default function Register() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden md:flex w-1/2 bg-black p-8 flex-col">
        <div className="text-white text-2xl font-bold mb-20 text-center">Cismedic</div>

        <div className="flex-1 flex flex-col justify-center items-center">
          {/* Icono del Teléfono */}
          <div className="relative w-40 h-40 mb-8">
            <Phone className="w-full h-full text-white" />
          </div>

          {/* Texto */}
          <h1 className="text-white text-4xl font-medium text-center max-w-md">
            Agenda tus citas médicas virtuales y/o presenciales de la manera{' '}
            <span className="text-[#FFEB3B]">más simple y rápida</span>
          </h1>
        </div>
      </div>

      {/* Right Panel - Full Width on Mobile */}
      <div className="flex-1 p-8 md:w-1/2">
        {step === 1 && <Paso1 onNext={() => setStep(2)} />}
        {step === 2 && <Paso2 onNext={() => setStep(3)} />}
      </div>
    </div>
  );
}