
import React from 'react';
import { Hunter, Platform, Rank } from '../types';

interface Props {
  hunter: Hunter;
  platform: Platform;
  onOpenSheet: () => void;
  onOpenMenu: () => void;
  onOpenStore: () => void;
}

const GameHUD: React.FC<Props> = ({ hunter, platform, onOpenSheet, onOpenMenu, onOpenStore }) => {
  const hpPercent = (hunter.hp / hunter.maxHp) * 100;
  const mpPercent = (hunter.mp / hunter.maxMp) * 100;

  const rankColors: Record<Rank, string> = {
    [Rank.E]: 'text-slate-400',
    [Rank.D]: 'text-green-400',
    [Rank.C]: 'text-blue-400',
    [Rank.B]: 'text-purple-400',
    [Rank.A]: 'text-red-400',
    [Rank.S]: 'text-orange-500'
  };

  return (
    <div className={`bg-slate-900 border-b border-slate-800 p-4 ${platform === Platform.DESKTOP ? 'flex justify-between items-center' : 'grid grid-cols-2 gap-4'}`}>
      <div className="flex items-center gap-4">
        {/* Profile Picture in HUD */}
        <div 
          onClick={onOpenSheet}
          className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-all shadow-inner relative group"
        >
          {hunter.avatarUrl ? (
            <img src={hunter.avatarUrl} alt="Hunter Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="text-xl opacity-40">👤</div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white font-system font-black text-[9px] w-5 h-5 flex items-center justify-center rounded-lg border border-slate-900">
            {hunter.level}
          </div>
        </div>

        <div className="group">
          <div className="flex items-center gap-2">
            <h3 className="font-system font-bold text-sm leading-tight uppercase transition-colors">{hunter.name}</h3>
            <span className={`font-system font-black text-xs ${rankColors[hunter.rank]}`}>RANK {hunter.rank}</span>
          </div>
          <div className="text-[9px] text-slate-500 font-system uppercase tracking-tighter italic">Hunter Classe: {hunter.class}</div>
        </div>
      </div>

      <div className={`flex flex-col gap-2 w-full max-w-xs ${platform === Platform.MOBILE ? 'col-span-full' : ''}`}>
        <div className="flex justify-between items-center text-[9px] font-system font-bold mb-[-4px]">
            <span className="text-red-500 uppercase">HP / SANGUE</span>
            <span className="text-slate-300">{Math.floor(hunter.hp)} / {hunter.maxHp}</span>
        </div>
        <div className="relative h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-[9px] font-system font-bold mb-[-4px] mt-1">
            <span className="text-blue-500 uppercase">MANA / MP</span>
            <span className="text-slate-300">{Math.floor(hunter.mp)} / {hunter.maxMp}</span>
        </div>
        <div className="relative h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${mpPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onOpenStore}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] font-system text-yellow-500 uppercase tracking-widest transition-all hover:border-yellow-600"
          title="Loja do Hunter"
        >
          🛒 LOJA
        </button>
        <button 
          onClick={onOpenSheet}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] font-system text-slate-300 uppercase tracking-widest transition-all hover:border-blue-500"
          title="Ficha do Hunter"
        >
          📜 FICHA
        </button>
        <button 
          onClick={onOpenMenu}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] font-system text-slate-300 uppercase tracking-widest transition-all hover:border-blue-500"
          title="Menu de Jogo"
        >
          ⚙️ MENU
        </button>
      </div>
    </div>
  );
};

export default GameHUD;
