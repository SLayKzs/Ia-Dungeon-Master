
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h1 className="text-4xl font-system font-black tracking-tighter text-white">
          IA <span className="text-blue-500">DUNGEON MASTER</span>
        </h1>
        <p className="mt-4 text-slate-500 tracking-widest text-xs uppercase font-system">Iniciando Sistema...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
