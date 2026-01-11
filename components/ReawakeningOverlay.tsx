
import React, { useEffect, useState } from 'react';
import { Hunter, Stats } from '../types';

interface Props {
  oldHunter: Hunter;
  newHunter: Hunter;
  onClose: () => void;
}

const ReawakeningOverlay: React.FC<Props> = ({ oldHunter, newHunter, onClose }) => {
  const [phase, setPhase] = useState<'intro' | 'stats' | 'rank'>('intro');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('stats'), 3000);
    const t2 = setTimeout(() => setPhase('rank'), 8000);
    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
    };
  }, []);

  const statKeys = Object.keys(newHunter.stats) as Array<keyof Stats>;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/10 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.9)_100%)]"></div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        {phase === 'intro' && (
          <div className="animate-fade-in space-y-6">
            <h1 className="text-4xl md:text-6xl font-system font-black text-blue-500 tracking-tighter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              SEGUNDO DESPERTAR
            </h1>
            <p className="text-slate-400 font-serif italic text-lg md:text-xl">
              "As amarras da sua alma se romperam. O Sistema está reescrevendo sua existência."
            </p>
          </div>
        )}

        {phase === 'stats' && (
          <div className="animate-slide-up w-full space-y-8">
            <h2 className="text-xl font-system font-bold text-slate-500 uppercase tracking-widest">EVOLUÇÃO DOS ATRIBUTOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statKeys.map(k => {
                const diff = newHunter.stats[k] - oldHunter.stats[k];
                return (
                  <div key={k} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex justify-between items-center group">
                    <span className="text-xs uppercase font-system text-slate-500">{k}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-600 text-sm">{oldHunter.stats[k]}</span>
                      <span className="text-blue-500">→</span>
                      <span className="text-blue-400 font-black text-lg animate-pulse">{newHunter.stats[k]}</span>
                      <span className="text-[10px] text-green-500 font-bold">+{diff}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 font-system uppercase animate-pulse">Mutação Celular em andamento...</p>
          </div>
        )}

        {phase === 'rank' && (
          <div className="animate-bounce-in flex flex-col items-center space-y-8">
            <div className="text-blue-500 font-system text-xs tracking-[1em] mb-4">NOVA CLASSIFICAÇÃO</div>
            <div className="flex items-center gap-8 md:gap-16">
                <div className="text-4xl md:text-6xl text-slate-800 font-system font-black opacity-40 line-through">{oldHunter.rank}</div>
                <div className="text-blue-600 animate-pulse text-2xl">⚡</div>
                <div className={`text-9xl md:text-[14rem] font-system font-black leading-none ${newHunter.rank === 'S' ? 'text-orange-500 drop-shadow-[0_0_50px_rgba(249,115,22,0.8)]' : 'text-blue-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]'}`}>
                    {newHunter.rank}
                </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 px-10 py-4 rounded-full text-blue-400 font-system text-sm animate-pulse tracking-widest mt-8">
              SISTEMA ATUALIZADO COM SUCESSO
            </div>
            <button 
              onClick={onClose}
              className="mt-12 px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-system font-bold rounded-xl transition-all shadow-2xl active:scale-95"
            >
              RETORNAR À REALIDADE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReawakeningOverlay;
