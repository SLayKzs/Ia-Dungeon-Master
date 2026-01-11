
import React, { useRef, useEffect, useState } from 'react';
import { DMResponse, Platform, NarrativeStyle } from '../types';

interface Props {
  response: DMResponse | null;
  onAction: (action: string) => void;
  loading: boolean;
  platform: Platform;
  narrativeStyle: NarrativeStyle;
  onToggleNarrative: () => void;
}

const NarrativeWindow: React.FC<Props> = ({ response, onAction, loading, platform, narrativeStyle, onToggleNarrative }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [freeAction, setFreeAction] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, loading]);

  const handleSubmitFreeAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (freeAction.trim() && !loading) {
      onAction(freeAction);
      setFreeAction('');
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Narrative Area */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-950 border border-slate-800/50 rounded-2xl p-8 overflow-y-auto space-y-8 scroll-smooth shadow-inner relative"
      >
        {/* Narrative Mode Toggle */}
        <div className="sticky top-0 right-0 flex justify-end z-10 pointer-events-none mb-4">
            <button 
                onClick={onToggleNarrative}
                className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-full text-[9px] font-system uppercase tracking-widest text-slate-400 hover:text-blue-400 hover:border-blue-500 transition-all shadow-xl"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Modo: {narrativeStyle === 'Detailed' ? 'Detalhado' : 'Simples'}
            </button>
        </div>

        {response ? (
          <div className="animate-fade-in">
            <div className={`prose prose-invert max-w-none text-slate-100 leading-relaxed font-serif ${narrativeStyle === 'Detailed' ? 'text-xl md:text-2xl font-normal' : 'text-lg font-light'} drop-shadow-sm`}>
              {response.narrative.split('\n').map((para, i) => (
                <p key={i} className="mb-8">{para}</p>
              ))}
            </div>
            {response.events && response.events.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-900">
                <h4 className="text-[10px] font-system text-blue-600 uppercase tracking-[0.3em] mb-4">RELATÓRIO DO SISTEMA</h4>
                <ul className="space-y-2">
                  {response.events.map((ev, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-center gap-3 font-system uppercase tracking-tighter">
                      <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 animate-pulse font-system italic space-y-6">
            <div className="w-16 h-16 border-2 border-slate-800 border-t-blue-500/20 rounded-full animate-spin"></div>
            <span className="tracking-widest uppercase text-xs">Aguardando Resposta do Sistema...</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 text-blue-500 font-system text-[10px] tracking-widest animate-pulse mt-8 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            SISTEMA RECALCULANDO REALIDADE...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        {/* Free Action Input */}
        <form onSubmit={handleSubmitFreeAction} className="relative group">
          <input 
            type="text"
            value={freeAction}
            onChange={(e) => setFreeAction(e.target.value)}
            disabled={loading}
            placeholder="Dite sua vontade ao Sistema..."
            className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white font-system focus:border-blue-500 outline-none transition-all group-hover:border-slate-700 pr-16 shadow-lg shadow-black/50"
          />
          <button 
            type="submit"
            disabled={!freeAction.trim() || loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-20 p-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>

        {/* Option Selection */}
        <div className={`grid ${platform === Platform.MOBILE ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
          {response?.options.map((opt, i) => (
            <button
              key={i}
              disabled={loading}
              onClick={() => onAction(opt)}
              className="p-4 bg-slate-900/50 border border-slate-800 hover:border-blue-600 hover:bg-slate-800/20 text-left transition-all rounded-xl group relative overflow-hidden"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-blue-600/0 group-hover:bg-blue-600 transition-all"></div>
              <div className="flex items-center gap-4">
                <span className="text-blue-600 font-system text-[10px] font-black opacity-30 group-hover:opacity-100">{i + 1}</span>
                <span className="text-sm font-medium text-slate-400 group-hover:text-white truncate">{opt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NarrativeWindow;
