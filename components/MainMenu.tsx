
import React from 'react';

interface Props {
  onStart: () => void;
}

const MainMenu: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center transition-all duration-1000">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-950/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          <div className="mb-2 text-[10px] font-system tracking-[0.8em] text-blue-500/80 uppercase">The System is Online</div>
          <h1 className="text-6xl md:text-8xl font-system font-black mb-16 text-white tracking-tighter drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            IA <span className="text-blue-500">DM</span>
          </h1>
          
          <div className="flex flex-col gap-4 w-full max-w-xs px-4">
            <button 
              onClick={onStart}
              className="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-system font-bold rounded-lg transition-all overflow-hidden shadow-xl shadow-blue-900/40"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              ▶️ INICIAR NOVO JOGO
            </button>
            <button className="w-full py-4 bg-slate-900/50 border border-slate-800 text-slate-500 font-system font-bold rounded-lg opacity-50 cursor-not-allowed">
              💾 CARREGAR SALVO
            </button>
            <button className="w-full py-4 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 font-system font-bold rounded-lg transition-colors">
              ⚙️ CONFIGURAÇÕES
            </button>
            <button className="w-full py-4 bg-slate-900/50 border border-slate-800 hover:bg-slate-800 text-slate-300 font-system font-bold rounded-lg transition-colors">
              📜 HISTÓRICO / LOGS
            </button>
            <button className="w-full py-4 bg-red-950/20 border border-red-900/20 hover:bg-red-950/40 text-red-400 font-system font-bold rounded-lg mt-8 transition-colors">
              ❌ SAIR
            </button>
          </div>
          
          <div className="mt-20 text-[8px] text-slate-600 font-system uppercase tracking-widest opacity-50">
            Powered by Gemini AI Engine • v1.5.0 Patch
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
