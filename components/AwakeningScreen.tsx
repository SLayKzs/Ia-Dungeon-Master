
import React, { useState, useEffect } from 'react';
import { Hunter, Rank, HunterClass, WealthFactor, PhysicalCondition, Stats } from '../types';
import { RANK_CHANCES, PHYSICAL_CONDITION_MODIFIERS } from '../constants';

interface Props {
  hunter: Hunter | null;
  onAwakenFinal: (h: Hunter) => void;
  isAwakened: boolean;
}

const AwakeningScreen: React.FC<Props> = ({ hunter, onAwakenFinal, isAwakened }) => {
  const [phase, setPhase] = useState<'intro' | 'rolling' | 'revealing' | 'summary'>('intro');
  const [awakenedHunter, setAwakenedHunter] = useState<Hunter | null>(null);

  const getRarityLabel = (rank: Rank) => {
    switch (rank) {
      case Rank.S: return 'LENDÁRIO';
      case Rank.A: return 'ÉPICO';
      case Rank.B: return 'SUPER RARO';
      case Rank.C: return 'RARO';
      case Rank.D: return 'INCOMUM';
      default: return 'COMUM';
    }
  };

  const startAwakening = () => {
    setPhase('rolling');
    
    setTimeout(() => {
      // 1. Roll Luck (Invisible factor)
      const luck = Math.floor(Math.random() * 100) + 1;
      
      // 2. Roll Physical Condition
      const conds = Object.values(PhysicalCondition);
      const condition = conds[Math.floor(Math.random() * conds.length)];
      const condMult = PHYSICAL_CONDITION_MODIFIERS[condition];

      // 3. Roll Rank (Patch Oficial - Novas Probabilidades)
      const roll = Math.random() * 100;
      let rank = Rank.E;
      let cumulative = 0;
      
      // Ordem de verificação do menor para o maior para corresponder às % acumuladas
      const rankOrder = [
        { r: Rank.S, p: RANK_CHANCES[Rank.S] },
        { r: Rank.A, p: RANK_CHANCES[Rank.A] },
        { r: Rank.B, p: RANK_CHANCES[Rank.B] },
        { r: Rank.C, p: RANK_CHANCES[Rank.C] },
        { r: Rank.D, p: RANK_CHANCES[Rank.D] },
        { r: Rank.E, p: RANK_CHANCES[Rank.E] }
      ];

      for (const item of rankOrder) {
        cumulative += item.p;
        if (roll <= cumulative) {
          rank = item.r;
          break;
        }
      }

      // 4. Random Stats (No manual distribution)
      const generateStat = () => Math.floor((Math.random() * 10 + 5) * condMult);
      const stats: Stats = {
        strength: generateStat(),
        agility: generateStat(),
        perception: generateStat(),
        vitality: generateStat(),
        intelligence: generateStat()
      };

      const classes: HunterClass[] = ['Fighter', 'Assassin', 'Mage', 'Tank', 'Ranger', 'Support'];
      const randomClass = classes[Math.floor(Math.random() * classes.length)];

      const wealthRoll = Math.random() + (luck / 500);
      let wealth = WealthFactor.POBRE;
      let gold = Math.floor(Math.random() * 400 * (luck/10)) + 100;

      if (wealthRoll > 0.85) {
        wealth = WealthFactor.RICO;
        gold = Math.floor(Math.random() * 10000) + 5000;
      } else if (wealthRoll > 0.5) {
        wealth = WealthFactor.CLASSE_MEDIA;
        gold = Math.floor(Math.random() * 2000) + 1000;
      }

      const objectives = [
        'Sustentar a família em tempos difíceis',
        'Pagar dívidas médicas acumuladas de parentes',
        'Buscar reconhecimento em um mundo de elites',
        'Sobreviver e descobrir a verdade sobre o Sistema',
        'Ficar mais forte para não ser mais humilhado',
        'Acumular riqueza para fugir da miséria'
      ];
      const objective = objectives[Math.floor(Math.random() * objectives.length)];

      const updatedHunter: Hunter = {
        ...hunter!,
        rank,
        class: randomClass,
        stats,
        luck,
        physicalCondition: condition,
        wealthFactor: wealth,
        gold,
        personalObjective: objective,
        awakeningHistory: {
          date: new Date().toLocaleDateString('pt-BR'),
          originalRank: rank,
          reawakened: false
        }
      };

      setAwakenedHunter(updatedHunter);
      setPhase('revealing');
    }, 4500);
  };

  useEffect(() => {
    if (phase === 'revealing') {
      const timer = setTimeout(() => {
        setPhase('summary');
        onAwakenFinal(awakenedHunter!);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, awakenedHunter, onAwakenFinal]);

  if (!hunter) return null;

  const rankS = awakenedHunter?.rank === Rank.S;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className={`absolute inset-0 bg-blue-600/5 transition-opacity duration-1000 ${phase !== 'intro' ? 'opacity-100 animate-pulse' : 'opacity-20'}`}></div>
      {phase === 'revealing' && rankS && (
        <div className="absolute inset-0 bg-orange-500/10 animate-ping duration-[3000ms]"></div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {phase === 'intro' && (
          <div className="flex flex-col items-center w-full animate-fade-in space-y-8">
            <h2 className="text-3xl font-system font-black mb-4 text-center tracking-tighter">SISTEMA DE <span className="text-blue-500">AWAKENING</span></h2>
            <div className="w-full bg-slate-900/60 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
              <p className="text-slate-300 text-sm leading-relaxed text-center font-serif italic mb-6">
                "Hunters não nascem fortes. Eles são revelados pelo Sistema. Seus atributos, sua sorte e sua condição física definem o destino que você não pode escolher."
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[9px] font-system uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-1">
                    <span>Possibilidade de Rank</span>
                    <span>Probabilidade</span>
                </div>
                {Object.entries(RANK_CHANCES).sort((a,b) => b[1] - a[1]).map(([r, chance]) => (
                  <div key={r} className="flex justify-between items-center group">
                    <span className={`text-xs font-system font-bold transition-colors ${r === Rank.S ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-200'}`}>Rank {r}</span>
                    <span className="text-[10px] text-slate-500 font-system">{chance}%</span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={startAwakening}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 font-system font-black rounded-xl transition-all text-xl shadow-2xl shadow-blue-600/20 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
              INICIAR PROTOCOLO
            </button>
            <p className="text-[9px] text-slate-600 uppercase font-system tracking-widest">Aviso: O resultado é irreversível e aleatório.</p>
          </div>
        )}

        {phase === 'rolling' && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">⚡</div>
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <div>
                <h3 className="text-xl font-system text-blue-400 tracking-widest uppercase mb-2">Sincronizando com o Sistema...</h3>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] animate-pulse">Analisando Biometria e Potencial Latente</p>
            </div>
          </div>
        )}

        {phase === 'revealing' && awakenedHunter && (
          <div className="flex flex-col items-center animate-bounce-in space-y-4">
             <div className={`${rankS ? 'text-orange-500' : 'text-blue-500/50'} font-system uppercase text-xs tracking-[0.5em] animate-pulse`}>
                {getRarityLabel(awakenedHunter.rank)} DETECTADO
             </div>
             <div className={`text-[12rem] font-system font-black leading-none transition-all ${rankS ? 'text-orange-500 drop-shadow-[0_0_60px_rgba(249,115,22,0.9)] animate-bounce' : 'text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]'}`}>
               {awakenedHunter.rank}
             </div>
             <div className="text-2xl font-system text-white tracking-[0.3em] uppercase opacity-80">RANK DEFINIDO</div>
          </div>
        )}

        {phase === 'summary' && awakenedHunter && (
          <div className="w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl animate-fade-in backdrop-blur-md relative overflow-hidden">
            {rankS && <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>}
            
            <h2 className="text-xl font-system font-black text-center mb-8 text-blue-500 uppercase tracking-widest border-b border-slate-800 pb-4">RELATÓRIO DE DESPERTAR</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <SummaryItem label="Hunter" value={awakenedHunter.name} />
              <SummaryItem label="Rank" value={awakenedHunter.rank} color={rankS ? 'text-orange-500' : 'text-blue-400'} />
              <SummaryItem label="Raridade" value={getRarityLabel(awakenedHunter.rank)} color={rankS ? 'text-orange-400' : 'text-slate-400'} />
              <SummaryItem label="Classe" value={awakenedHunter.class} />
              <SummaryItem label="Condição Física" value={awakenedHunter.physicalCondition} />
              <SummaryItem label="Saldo Inicial" value={`💰 ${awakenedHunter.gold}`} />
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
               <h4 className="text-[10px] font-system text-slate-500 uppercase tracking-widest mb-3">DIRETRIZ DE VIDA</h4>
               <p className="text-slate-200 text-sm italic font-serif leading-relaxed">"{awakenedHunter.personalObjective}"</p>
            </div>

            <div className="mt-10 text-center space-y-3">
               <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-progress"></div>
               </div>
               <p className="text-[9px] text-blue-500 font-system animate-pulse tracking-[0.3em] uppercase">Transferindo consciência para o novo mundo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, color = 'text-white' }: { label: string, value: string, color?: string }) => (
  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center text-center hover:border-slate-700 transition-colors">
    <div className="text-[8px] text-slate-500 font-system uppercase tracking-widest mb-2">{label}</div>
    <div className={`font-system font-bold text-xs ${color} uppercase`}>{value}</div>
  </div>
);

export default AwakeningScreen;
