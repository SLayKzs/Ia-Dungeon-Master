
import React from 'react';
import { Guild, Rank } from '../types';

interface Props {
  guild: Guild;
  onAccept: () => void;
  onDecline: () => void;
  hunterAvatar?: string;
}

const GuildInvitationOverlay: React.FC<Props> = ({ guild, onAccept, onDecline, hunterAvatar }) => {
  const rankColors: Record<Rank, string> = {
    [Rank.E]: 'text-slate-400',
    [Rank.D]: 'text-green-400',
    [Rank.C]: 'text-blue-400',
    [Rank.B]: 'text-purple-400',
    [Rank.A]: 'text-red-400',
    [Rank.S]: 'text-orange-500'
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/95 flex items-center justify-center p-8 animate-fade-in backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-blue-900/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl">🛡️</div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center mb-4">
             {/* Small visual flair: Player and Guild Icon */}
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-blue-500/50 overflow-hidden bg-slate-950">
                   {hunterAvatar ? <img src={hunterAvatar} className="w-full h-full object-cover" /> : <div className="text-xl flex items-center justify-center h-full">👤</div>}
                </div>
                <div className="text-blue-500 animate-pulse text-xl">🤝</div>
                <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center bg-slate-950 text-xl">
                   🛡️
                </div>
             </div>
          </div>

          <div className="text-center space-y-2">
            <h4 className="text-[10px] font-system text-blue-500 uppercase tracking-[0.5em] animate-pulse">CONTATO DE GUILDA DETECTADO</h4>
            <h2 className="text-4xl font-system font-black tracking-tighter uppercase text-white">GUILDA {guild.name}</h2>
            <span className={`inline-block px-3 py-1 rounded bg-slate-950 border border-slate-800 font-system font-bold ${rankColors[guild.rank]}`}>RANK {guild.rank}</span>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 italic font-serif text-slate-300 leading-relaxed">
            "{guild.description}"
          </div>

          <div className="space-y-3">
            <h5 className="text-[9px] font-system text-slate-500 uppercase tracking-widest">BENEFÍCIOS OFERECIDOS:</h5>
            <div className="grid grid-cols-1 gap-2">
              {guild.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-slate-400 bg-blue-950/20 p-2 rounded-lg border border-blue-900/30">
                  <span className="text-blue-500">◈</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={onAccept}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-system font-bold rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              ACEITAR CONVITE
            </button>
            <button 
              onClick={onDecline}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-system font-bold rounded-xl transition-all active:scale-95"
            >
              IGNORAR PROPOSTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildInvitationOverlay;
