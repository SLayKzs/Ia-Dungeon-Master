
import React, { useState, useEffect, useMemo } from 'react';
import { GameState, Platform, GameMode, Rank, Hunter, DMResponse, Item, Stats, WealthFactor, PhysicalCondition, Guild, GuildRank, Contact, WorldEvent } from './types';
import { INITIAL_STATS, PHYSICAL_CONDITION_MODIFIERS } from './constants';
import SplashScreen from './components/SplashScreen';
import PlatformSelector from './components/PlatformSelector';
import MainMenu from './components/MainMenu';
import ProfileCreation from './components/ProfileCreation';
import AwakeningScreen from './components/AwakeningScreen';
import GameHUD from './components/GameHUD';
import NarrativeWindow from './components/NarrativeWindow';
import HunterSheet from './components/HunterSheet';
import Store from './components/Store';
import ReawakeningOverlay from './components/ReawakeningOverlay';
import GuildInvitationOverlay from './components/GuildInvitationOverlay';
import { generateScene } from './geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'splash' | 'platform' | 'menu' | 'profile' | 'awakening' | 'game'>('splash');
  const [showSheet, setShowSheet] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [reawakeningData, setReawakeningData] = useState<{ oldHunter: Hunter, newHunter: Hunter } | null>(null);
  const [pendingGuildInvitation, setPendingGuildInvitation] = useState<Guild | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    hunter: null,
    mode: GameMode.NORMAL,
    platform: null,
    narrativeStyle: 'Detailed',
    currentScene: '',
    history: [],
    isAwakened: false,
    activeGate: null
  });
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<DMResponse | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStep('platform'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const selectPlatform = (p: Platform) => {
    setGameState(prev => ({ ...prev, platform: p }));
    setStep('menu');
  };

  const startNewGame = () => setStep('profile');

  const createProfile = (name: string) => {
    setGameState(prev => ({
      ...prev,
      hunter: {
        name,
        age: Math.floor(Math.random() * 15) + 18,
        class: 'Fighter',
        rank: Rank.E,
        level: 1,
        exp: 0,
        nextLevelExp: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        stats: { ...INITIAL_STATS },
        luck: 10,
        physicalCondition: PhysicalCondition.NORMAL,
        statPoints: 0,
        gold: 0,
        inventory: [],
        equipment: {},
        shadows: [],
        status: [],
        contacts: [],
        worldLog: [],
        guild: null,
        guildHistory: []
      }
    }));
    setStep('awakening');
  };

  const finalizeAwakening = (finalHunter: Hunter) => {
    setGameState(prev => ({
      ...prev,
      isAwakened: true,
      hunter: finalHunter
    }));

    setTimeout(() => {
        handleAction("Acordar no hospital após o despertar. Minha nova vida como Hunter começa agora.");
        setStep('game');
    }, 4500);
  };

  const handleAction = async (action: string) => {
    if (!action.trim()) return;
    setLoading(true);
    const response = await generateScene(gameState, action);
    setLastResponse(response);
    
    setGameState(prev => {
      if (!prev.hunter) return prev;
      
      let updatedHunter = { ...prev.hunter };
      
      if (response.updates) {
        if (response.updates.guildInvitation) {
            setPendingGuildInvitation(response.updates.guildInvitation as Guild);
        }

        const newRank = response.updates.rank as Rank | undefined;
        const rankChanged = newRank && newRank !== prev.hunter.rank;

        if (rankChanged && prev.isAwakened) {
            const oldHunter = { ...prev.hunter };
            const boostMult = 1.5 + (Math.random() * 1.5);
            const newStats: Stats = { ...oldHunter.stats };
            const statKeys = Object.keys(newStats) as Array<keyof Stats>;
            statKeys.forEach(k => newStats[k] = Math.floor(newStats[k] * boostMult));

            const reawakenedHunter: Hunter = {
                ...oldHunter,
                ...response.updates,
                rank: newRank,
                stats: newStats,
                awakeningHistory: {
                    ...oldHunter.awakeningHistory!,
                    reawakened: true,
                    reawakeningDate: new Date().toLocaleDateString('pt-BR'),
                    oldRank: oldHunter.rank,
                    newRank: newRank,
                    statsBefore: { ...oldHunter.stats },
                    statsAfter: newStats
                }
            };

            setReawakeningData({ oldHunter, newHunter: reawakenedHunter });
            return {
                ...prev,
                hunter: reawakenedHunter,
                history: [...prev.history, { role: 'user', text: action }, { role: 'system', text: response.narrative }]
            };
        }

        const updates = { ...response.updates };
        
        updatedHunter = { 
          ...prev.hunter, 
          ...updates,
          contacts: updates.contacts ? [...prev.hunter.contacts, ...updates.contacts] : prev.hunter.contacts,
          worldLog: updates.worldLog ? [...prev.hunter.worldLog, ...updates.worldLog] : prev.hunter.worldLog,
          shadows: updates.shadows ? [...prev.hunter.shadows, ...updates.shadows] : prev.hunter.shadows
        };
      }

      return {
        ...prev,
        hunter: updatedHunter,
        history: [...prev.history, { role: 'user', text: action }, { role: 'system', text: response.narrative }]
      };
    });
    setLoading(false);
  };

  const handleUpdateAvatar = (url: string) => {
    setGameState(prev => {
      if (!prev.hunter) return prev;
      return {
        ...prev,
        hunter: { ...prev.hunter, avatarUrl: url }
      };
    });
  };

  const handleCallContact = (contact: Contact) => {
    setShowSheet(false);
    handleAction(`Fazer uma ligação para o contato: ${contact.name} (${contact.profession}).`);
  };

  const handleAcceptGuild = (guild: Guild) => {
    setGameState(prev => {
        if (!prev.hunter) return prev;
        const updatedGuild = { ...guild, playerRank: GuildRank.RECRUTA, reputation: 10 };
        return {
            ...prev,
            hunter: { 
                ...prev.hunter, 
                guild: updatedGuild, 
                guildHistory: [...prev.hunter.guildHistory, guild.name] 
            }
        };
    });
    setPendingGuildInvitation(null);
    handleAction(`Aceitar o convite da guilda ${guild.name}.`);
  };

  const handleDeclineGuild = (guild: Guild) => {
    setGameState(prev => {
        if (!prev.hunter) return prev;
        return {
            ...prev,
            hunter: { 
                ...prev.hunter, 
                guildHistory: [...prev.hunter.guildHistory, `Recusou: ${guild.name}`] 
            }
        };
    });
    setPendingGuildInvitation(null);
    handleAction(`Recusar educadamente o convite da guilda ${guild.name}.`);
  };

  const currentHunter = useMemo(() => {
    if (!gameState.hunter) return null;
    const h = { ...gameState.hunter };
    const baseStats = h.stats;
    const bonus: Partial<Stats> = { strength: 0, agility: 0, perception: 0, vitality: 0, intelligence: 0 };
    
    (Object.values(h.equipment) as Array<Item | undefined>).forEach(item => {
      if (item?.bonusStats) {
        (Object.keys(item.bonusStats) as Array<keyof Stats>).forEach(stat => {
          bonus[stat]! += item.bonusStats![stat] || 0;
        });
      }
    });

    const finalStats: Stats = {
      strength: baseStats.strength + (bonus.strength || 0),
      agility: baseStats.agility + (bonus.agility || 0),
      perception: baseStats.perception + (bonus.perception || 0),
      vitality: baseStats.vitality + (bonus.vitality || 0),
      intelligence: baseStats.intelligence + (bonus.intelligence || 0),
    };

    return {
      ...h,
      stats: finalStats,
      maxHp: 50 + (finalStats.vitality * 10),
      maxMp: 20 + (finalStats.intelligence * 5),
    };
  }, [gameState.hunter]);

  const handleEquip = (item: Item) => {
    setGameState(prev => {
      if (!prev.hunter) return prev;
      const newEquip = { ...prev.hunter.equipment };
      if (item.type === 'Weapon') newEquip.weapon = item;
      if (item.type === 'Armor') newEquip.armor = item;
      if (item.type === 'Helmet') newEquip.helmet = item;
      if (item.type === 'Relic') newEquip.relic = item;
      if (item.type === 'Accessory') newEquip.accessory = item;
      if (item.type === 'Support') newEquip.support = item;
      
      return {
        ...prev,
        hunter: { ...prev.hunter, equipment: newEquip }
      };
    });
  };

  const handleUnequip = (type: keyof Hunter['equipment']) => {
    setGameState(prev => {
      if (!prev.hunter) return prev;
      const newEquip = { ...prev.hunter.equipment };
      delete newEquip[type];
      return {
        ...prev,
        hunter: { ...prev.hunter, equipment: newEquip }
      };
    });
  };

  const handleBuyItem = (item: Item) => {
    setGameState(prev => {
      if (!prev.hunter || prev.hunter.gold < item.value) return prev;
      return {
        ...prev,
        hunter: {
          ...prev.hunter,
          gold: prev.hunter.gold - item.value,
          inventory: [...prev.hunter.inventory, { ...item, id: Math.random().toString(36).substr(2, 9) }]
        }
      };
    });
  };

  const handleSellItem = (item: Item) => {
    setGameState(prev => {
      if (!prev.hunter) return prev;
      const newInventory = prev.hunter.inventory.filter(i => i.id !== item.id);
      return {
        ...prev,
        hunter: {
          ...prev.hunter,
          gold: prev.hunter.gold + Math.floor(item.value * 0.5),
          inventory: newInventory
        }
      };
    });
  };

  return (
    <div className={`h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden ${gameState.platform === Platform.MOBILE ? 'max-w-md mx-auto border-x border-slate-800 shadow-2xl shadow-blue-900/10' : ''}`}>
      {step === 'splash' && <SplashScreen />}
      {step === 'platform' && <PlatformSelector onSelect={selectPlatform} />}
      {step === 'menu' && <MainMenu onStart={startNewGame} />}
      {step === 'profile' && <ProfileCreation onCreate={createProfile} />}
      {step === 'awakening' && <AwakeningScreen hunter={gameState.hunter} onAwakenFinal={finalizeAwakening} isAwakened={gameState.isAwakened} />}
      
      {step === 'game' && currentHunter && (
        <>
          <GameHUD 
            hunter={currentHunter} 
            platform={gameState.platform!} 
            onOpenSheet={() => setShowSheet(true)}
            onOpenMenu={() => setShowMenu(true)}
            onOpenStore={() => setShowStore(true)}
          />
          <div className="flex-1 overflow-hidden relative">
            <div className="h-full p-4">
              <NarrativeWindow 
                response={lastResponse} 
                onAction={handleAction} 
                loading={loading} 
                platform={gameState.platform!}
                narrativeStyle={gameState.narrativeStyle}
                onToggleNarrative={() => setGameState(p => ({...p, narrativeStyle: p.narrativeStyle === 'Detailed' ? 'Simplified' : 'Detailed'}))}
              />
            </div>
            {showSheet && (
              <HunterSheet 
                hunter={currentHunter} 
                onClose={() => setShowSheet(false)} 
                onEquip={handleEquip}
                onUnequip={handleUnequip}
                onUpdateAvatar={handleUpdateAvatar}
                onCallContact={handleCallContact}
              />
            )}
            {showStore && (
              <Store 
                hunter={currentHunter}
                onClose={() => setShowStore(false)}
                onBuy={handleBuyItem}
                onSell={handleSellItem}
              />
            )}
            {reawakeningData && (
              <ReawakeningOverlay 
                oldHunter={reawakeningData.oldHunter} 
                newHunter={reawakeningData.newHunter} 
                onClose={() => setReawakeningData(null)} 
              />
            )}
            {pendingGuildInvitation && (
                <GuildInvitationOverlay 
                    guild={pendingGuildInvitation}
                    onAccept={() => handleAcceptGuild(pendingGuildInvitation)}
                    onDecline={() => handleDeclineGuild(pendingGuildInvitation)}
                    hunterAvatar={currentHunter.avatarUrl}
                />
            )}
            {showMenu && (
              <div className="absolute inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
                  <h2 className="text-xl font-system text-center mb-6 text-blue-400">MENU DO SISTEMA</h2>
                  <button onClick={() => { localStorage.setItem('dm_save', JSON.stringify(gameState)); alert("Salvo!"); setShowMenu(false); }} className="w-full py-3 bg-blue-600 font-system rounded-lg">💾 SALVAR JOGO</button>
                  <button onClick={() => setShowMenu(false)} className="w-full py-3 bg-slate-700 font-system rounded-lg">🔙 VOLTAR AO JOGO</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
