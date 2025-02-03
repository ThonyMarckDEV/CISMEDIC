import React, { useState } from 'react';
import { Phone, Heart, ChevronLeft } from 'lucide-react';
import Paso1 from '../components/home/Paso1';
import Paso2 from '../components/home/Paso2';

export default function Register() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-black p-8 flex flex-col">
        <div className="text-white text-2xl font-bold mb-20">Cismedic</div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0">
              <Phone className="w-full h-full text-white" />
            </div>
          </div>
          
          <h1 className="text-white text-4xl font-medium text-center max-w-md">
            Agenda tus citas médicas virtuales y/o presenciales de la manera{" "}
            <span className="text-[#FFEB3B]">más simple y rápida</span>
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-8">
        {step === 1 && <Paso1 onNext={() => setStep(2)} />}
        {step === 2 && <Paso2 onNext={() => setStep(3)} />}
      </div>
    </div>
  );
}