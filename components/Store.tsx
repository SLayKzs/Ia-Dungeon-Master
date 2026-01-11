
import React, { useState, useMemo } from 'react';
import { Hunter, Item, Rank } from '../types';

interface Props {
  hunter: Hunter;
  onClose: () => void;
  onBuy: (item: Item) => void;
  onSell: (item: Item) => void;
}

const STORE_ITEMS_MASTER: Item[] = [
  { id: '1', name: 'Poção de Vida Menor', type: 'Consumable', rank: Rank.E, value: 50, weight: 0.1, description: 'Recupera 30 HP imediatamente.' },
  { id: '2', name: 'Poção de Mana Menor', type: 'Consumable', rank: Rank.E, value: 50, weight: 0.1, description: 'Recupera 20 MP imediatamente.' },
  { id: '3', name: 'Adaga de Treino', type: 'Weapon', rank: Rank.E, bonusStats: { strength: 2 }, value: 200, weight: 1.5, description: 'Lâmina básica para iniciantes.' },
  { id: '4', name: 'Capacete de Recruta', type: 'Helmet', rank: Rank.E, bonusStats: { vitality: 1 }, value: 150, weight: 1.0, description: 'Proteção craniana simples.' },
  // FIX: Removed 'mp' from bonusStats because 'mp' is not a property of the Stats interface.
  { id: '5', name: 'Relíquia do Esquecido', type: 'Relic', rank: Rank.D, bonusStats: { intelligence: 10 }, value: 5000, weight: 0.5, description: 'Um amuleto antigo que pulsa com mana residual.' },
  { id: '6', name: 'Elmo de Batalha Hunter', type: 'Helmet', rank: Rank.D, bonusStats: { vitality: 5, perception: 2 }, value: 1200, weight: 2.5, description: 'Equipamento padrão de incursão.' },
  { id: '7', name: 'Espada Larga de Aço', type: 'Weapon', rank: Rank.D, bonusStats: { strength: 12 }, value: 1800, weight: 6.0, description: 'Pesada, mas mortal contra monstros Rank D.' }
];

const Store: React.FC<Props> = ({ hunter, onClose, onBuy, onSell }) => {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');

  const availableItems = useMemo(() => {
    return STORE_ITEMS_MASTER.filter(item => {
        const rankOrder = [Rank.E, Rank.D, Rank.C, Rank.B, Rank.A, Rank.S];
        const hIndex = rankOrder.indexOf(hunter.rank);
        const iIndex = rankOrder.indexOf(item.rank);
        return iIndex <= hIndex + 1;
    });
  }, [hunter.rank]);

  const manaStonesCount = hunter.inventory.filter(i => i.type === 'ManaStone').length;

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col overflow-hidden animate-slide-up">
      <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <h2 className="text-2xl font-system font-black tracking-tighter uppercase">BALCÃO DO <span className="text-yellow-500">SISTEMA</span></h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-2xl">✕</button>
      </div>

      <div className="flex border-b border-slate-800">
        <button onClick={() => setTab('buy')} className={`flex-1 py-4 font-system font-bold text-xs tracking-widest ${tab === 'buy' ? 'bg-yellow-500/10 text-yellow-500 border-b-2 border-yellow-500' : 'text-slate-600'}`}>COMPRAR</button>
        <button onClick={() => setTab('sell')} className={`flex-1 py-4 font-system font-bold text-xs tracking-widest ${tab === 'sell' ? 'bg-blue-500/10 text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'}`}>VENDER / LIQUIDAR</button>
      </div>

      <div className="p-4 bg-slate-900/50 flex justify-between items-center text-[10px] font-system uppercase tracking-[0.2em] border-b border-slate-800">
          <span className="text-slate-500">SALDO: <span className="text-yellow-500 font-black">💰 {hunter.gold}</span></span>
          {manaStonesCount > 0 && (
            <button 
                onClick={() => hunter.inventory.filter(i => i.type === 'ManaStone').forEach(onSell)}
                className="bg-purple-900/20 border border-purple-500/50 text-purple-400 px-3 py-1 rounded-md animate-pulse"
            >
                Liquidificar Pedras de Mana ({manaStonesCount})
            </button>
          )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
        {tab === 'buy' ? (
          availableItems.map((item) => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-xl hover:border-yellow-500/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.type === 'Weapon' ? '⚔️' : item.type === 'Armor' ? '🛡️' : item.type === 'Helmet' ? '🪖' : item.type === 'Relic' ? '✨' : '🧪'}</span>
                  <div className="flex flex-col">
                    <span className="font-system font-bold text-sm text-white uppercase">{item.name}</span>
                    <span className={`text-[8px] font-black w-fit px-1.5 rounded-sm bg-slate-950 border border-slate-800 text-blue-500`}>RANK {item.rank}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic leading-tight">{item.description}</p>
              </div>
              <div className="flex flex-col items-end gap-3 ml-4">
                <span className="text-yellow-500 font-system font-black text-lg">💰 {item.value}</span>
                <button 
                  disabled={hunter.gold < item.value}
                  onClick={() => onBuy(item)}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-[10px] font-system font-bold rounded-lg transition-all active:scale-95 disabled:opacity-20"
                >Adquirir</button>
              </div>
            </div>
          ))
        ) : (
          hunter.inventory.map((item) => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-xl">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.type === 'ManaStone' ? '💎' : '📦'}</span>
                <div>
                  <div className="font-system font-bold text-white uppercase text-sm">{item.name}</div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">Valor: <span className="text-yellow-500">💰 {Math.floor(item.value * 0.5)}</span></p>
                </div>
              </div>
              <button onClick={() => onSell(item)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-system font-bold rounded-lg uppercase shadow-lg active:scale-95">Vender</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Store;
