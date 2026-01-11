
import React from 'react';
import { Platform } from '../types';

interface Props {
  onSelect: (p: Platform) => void;
}

const PlatformSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950">
      <h2 className="text-2xl font-system mb-12 text-center">SELECIONE A INTERFACE</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <button 
          onClick={() => onSelect(Platform.MOBILE)}
          className="group p-8 border border-slate-800 bg-slate-900 rounded-xl hover:border-blue-500 transition-all flex flex-col items-center gap-4"
        >
          <div className="text-4xl">📱</div>
          <span className="font-system text-xl font-bold group-hover:text-blue-400 transition-colors">MOBILE</span>
          <p className="text-slate-500 text-sm text-center">Interface vertical e simplificada otimizada para toque.</p>
        </button>
        <button 
          onClick={() => onSelect(Platform.DESKTOP)}
          className="group p-8 border border-slate-800 bg-slate-900 rounded-xl hover:border-blue-500 transition-all flex flex-col items-center gap-4"
        >
          <div className="text-4xl">🖥️</div>
          <span className="font-system text-xl font-bold group-hover:text-blue-400 transition-colors">DESKTOP</span>
          <p className="text-slate-500 text-sm text-center">Interface horizontal completa com detalhes avançados.</p>
        </button>
      </div>
    </div>
  );
};

export default PlatformSelector;
