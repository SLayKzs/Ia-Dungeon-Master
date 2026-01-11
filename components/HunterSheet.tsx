
import React, { useState, useRef } from 'react';
import { Hunter, Item, Rank, Stats, Contact, FriendshipLevel, Shadow } from '../types';

interface Props {
  hunter: Hunter;
  onClose: () => void;
  onEquip: (item: Item) => void;
  onUnequip: (type: keyof Hunter['equipment']) => void;
  onUpdateAvatar: (url: string) => void;
  onCallContact: (contact: Contact) => void;
}

const HunterSheet: React.FC<Props> = ({ hunter, onClose, onEquip, onUnequip, onUpdateAvatar, onCallContact }) => {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'SYSTEM' | 'ARMY' | 'SOCIAL'>('STATUS');
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rankColors: Record<Rank, string> = {
    [Rank.E]: 'text-slate-400',
    [Rank.D]: 'text-green-400',
    [Rank.C]: 'text-blue-400',
    [Rank.B]: 'text-purple-400',
    [Rank.A]: 'text-red-400',
    [Rank.S]: 'text-orange-500'
  };

  const handleDragStart = (item: Item) => setDraggedItem(item);
  const handleDropOnSlot = (e: React.DragEvent, type: Item['type']) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === type) {
      onEquip(draggedItem);
      setDraggedItem(null);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950 z-40 flex flex-col overflow-hidden animate-slide-up">
      {/* Header com Navegação Restaurada */}
      <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <h2 className="text-xl md:text-2xl font-system font-black tracking-tighter uppercase">HUD DO <span className="text-blue-500">SISTEMA</span></h2>
            <div className="flex flex-wrap gap-2">
                {['STATUS', 'SYSTEM', 'ARMY', 'SOCIAL'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setActiveTab(t as any)}
                        className={`text-[9px] md:text-[10px] font-system font-black tracking-[0.2em] px-3 md:px-5 py-2 rounded-lg border transition-all ${activeTab === t ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}
                    >
                        {t === 'STATUS' ? 'PERFIL' : t === 'SYSTEM' ? 'SISTEMA' : t === 'ARMY' ? 'EXÉRCITO' : 'SOCIAL'}
                    </button>
                ))}
            </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-2xl text-slate-500 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_100%)]">
        {activeTab === 'STATUS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Coluna Esquerda: Avatar e Atributos */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent"></div>
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 bg-blue-900/10 rounded-3xl border-2 border-blue-500/30 flex items-center justify-center overflow-hidden shadow-2xl relative group cursor-pointer active:scale-95 transition-all"
                  >
                    {hunter.avatarUrl ? <img src={hunter.avatarUrl} className="w-full h-full object-cover" /> : <div className="text-4xl opacity-40">👤</div>}
                    <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-system font-bold text-white uppercase text-center p-2 transition-opacity">Atualizar Biometria</div>
                    <input type="file" ref={fileInputRef} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => onUpdateAvatar(reader.result as string);
                            reader.readAsDataURL(file);
                        }
                    }} accept="image/*" className="hidden" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-system font-black uppercase tracking-widest text-white leading-none mb-2">{hunter.name}</h3>
                    <div className="flex gap-3 items-center">
                      <p className={`font-system font-black text-sm ${rankColors[hunter.rank]}`}>RANK {hunter.rank}</p>
                      <span className="text-slate-700 text-xs">•</span>
                      <p className="text-[10px] text-slate-500 font-system uppercase tracking-widest">{hunter.level} LEVEL</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <StatRow label="Strength" value={hunter.stats.strength} />
                  <StatRow label="Agility" value={hunter.stats.agility} />
                  <StatRow label="Perception" value={hunter.stats.perception} />
                  <StatRow label="Vitality" value={hunter.stats.vitality} />
                  <StatRow label="Intelligence" value={hunter.stats.intelligence} />
                </div>
              </div>

              {/* Sinalizadores de Status Restaurados */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                 <h4 className="text-[10px] font-system text-slate-500 mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    Sinalizadores de Status
                 </h4>
                 {hunter.status.length > 0 ? (
                   <div className="flex flex-wrap gap-2">
                     {hunter.status.map((s, i) => (
                       <span key={i} className="px-3 py-1 bg-red-950/30 text-red-500 text-[9px] font-system font-bold rounded border border-red-900/30 uppercase">{s}</span>
                     ))}
                   </div>
                 ) : (
                   <p className="text-[9px] text-slate-700 italic font-system uppercase tracking-widest">Nenhuma anomalia detectada.</p>
                 )}
              </div>
            </div>

            {/* Coluna Central: Equipamentos Restaurados */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center py-8 bg-slate-900/20 border border-slate-800/50 rounded-3xl shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full"></div>
                <h4 className="text-xs font-system font-black mb-8 uppercase text-blue-500 tracking-[0.5em] relative z-10">Equipamentos Ativos</h4>
                
                <div className="grid grid-cols-2 gap-6 relative z-10">
                    <EquipSlot label="CAPACETE" item={hunter.equipment.helmet} type="Helmet" onDrop={(e: any) => handleDropOnSlot(e, 'Helmet')} onUnequip={() => onUnequip('helmet')} />
                    <EquipSlot label="RELÍQUIA" item={hunter.equipment.relic} type="Relic" onDrop={(e: any) => handleDropOnSlot(e, 'Relic')} onUnequip={() => onUnequip('relic')} />
                    <EquipSlot label="ARMA" item={hunter.equipment.weapon} type="Weapon" onDrop={(e: any) => handleDropOnSlot(e, 'Weapon')} onUnequip={() => onUnequip('weapon')} />
                    <EquipSlot label="ARMADURA" item={hunter.equipment.armor} type="Armor" onDrop={(e: any) => handleDropOnSlot(e, 'Armor')} onUnequip={() => onUnequip('armor')} />
                    <EquipSlot label="ACESSÓRIO" item={hunter.equipment.accessory} type="Accessory" onDrop={(e: any) => handleDropOnSlot(e, 'Accessory')} onUnequip={() => onUnequip('accessory')} />
                    <EquipSlot label="SUPORTE" item={hunter.equipment.support} type="Support" onDrop={(e: any) => handleDropOnSlot(e, 'Support')} onUnequip={() => onUnequip('support')} />
                </div>
            </div>

            {/* Coluna Direita: Inventário e Biometria */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <h4 className="text-xs font-system font-black mb-6 uppercase border-b border-slate-800 pb-3 tracking-widest text-slate-400">Inventário</h4>
                <div className="grid grid-cols-4 gap-2">
                  {hunter.inventory.map((item) => (
                    <div 
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      className="w-full aspect-square bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center cursor-grab hover:border-blue-500 transition-all shadow-inner group active:scale-95"
                      title={`${item.name} (${item.rank})`}
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {item.type === 'Weapon' ? '⚔️' : item.type === 'Armor' ? '🛡️' : item.type === 'Helmet' ? '🪖' : item.type === 'Relic' ? '✨' : item.type === 'ManaStone' ? '💎' : '🧪'}
                      </span>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 16 - hunter.inventory.length) }).map((_, i) => (
                    <div key={i} className="w-full aspect-square bg-slate-950/20 border border-slate-900/20 rounded-lg"></div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between items-center text-[10px] font-system font-black uppercase tracking-[0.2em] bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-yellow-500">💰 {hunter.gold} Ouro</span>
                    <span className="text-slate-600">CAP: {hunter.inventory.length}/20</span>
                </div>
              </div>

              {/* Dados Biométricos Restaurados */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                 <h4 className="text-[9px] font-system text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2">Informações Adicionais</h4>
                 <div className="flex justify-between text-[11px] font-system">
                    <span className="text-slate-500 uppercase">Idade</span>
                    <span className="text-slate-300">{hunter.age} anos</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-system">
                    <span className="text-slate-500 uppercase">Riqueza</span>
                    <span className="text-slate-300">{hunter.wealthFactor}</span>
                 </div>
                 <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 mt-2">
                    <p className="text-[10px] text-slate-500 italic font-serif leading-relaxed">"{hunter.personalObjective}"</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
             {/* Histórico de Despertar Restaurado */}
             <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl">⚡</div>
                <h3 className="text-xl font-system font-black text-blue-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Histórico de Awakening</h3>
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-950 p-5 rounded-2xl border border-slate-800">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Primeiro Despertar</p>
                            <p className="text-sm font-system font-bold text-white">{hunter.awakeningHistory?.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rank Inicial</p>
                            <p className={`text-2xl font-system font-black ${rankColors[hunter.awakeningHistory?.originalRank || Rank.E]}`}>{hunter.awakeningHistory?.originalRank}</p>
                        </div>
                    </div>

                    {hunter.awakeningHistory?.reawakened && (
                        <div className="flex justify-between items-center bg-blue-900/10 p-5 rounded-2xl border border-blue-500/30 relative">
                            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">REAWAKENING DETECTADO</p>
                                <p className="text-sm font-system font-bold text-white">{hunter.awakeningHistory.reawakeningDate}</p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rank Antigo</p>
                                    <p className="text-xl font-system font-black text-slate-600 line-through">{hunter.awakeningHistory.oldRank}</p>
                                </div>
                                <div className="text-blue-500 text-xl animate-pulse">➔</div>
                                <div>
                                    <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">Novo Rank</p>
                                    <p className={`text-3xl font-system font-black ${rankColors[hunter.awakeningHistory.newRank || Rank.E]}`}>{hunter.awakeningHistory.newRank}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
             </div>

             {/* Informações da Guilda Restauradas */}
             <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl group-hover:scale-110 transition-transform">🛡️</div>
                <h3 className="text-xl font-system font-black text-blue-500 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Afiliação à Guilda</h3>
                {hunter.guild ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-2xl font-system font-black text-white">{hunter.guild.name}</h4>
                            <span className={`px-3 py-1 bg-slate-950 border border-slate-800 text-xs font-bold ${rankColors[hunter.guild.rank]}`}>RANK {hunter.guild.rank}</span>
                        </div>
                        <p className="text-sm text-slate-400 font-serif italic leading-relaxed">"{hunter.guild.description}"</p>
                        <div className="pt-4 space-y-2">
                             <div className="flex justify-between text-[10px] uppercase text-slate-500">
                                <span>Reputação Interna</span>
                                <span className="text-blue-400">{hunter.guild.reputation}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${hunter.guild.reputation}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <h5 className="text-[10px] font-system text-slate-500 uppercase tracking-widest mb-2">Sua Posição</h5>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/30 text-2xl">🎖️</div>
                            <div>
                                <p className="text-lg font-system font-black text-white">{hunter.guild.playerRank}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Membro Oficial desde {hunter.awakeningHistory?.date}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-900">
                            <h6 className="text-[9px] font-system text-slate-600 uppercase tracking-widest mb-3">Benefícios Ativos</h6>
                            <div className="flex flex-wrap gap-2">
                                {hunter.guild.benefits.map((b, i) => (
                                    <span key={i} className="text-[9px] font-system px-2 py-1 bg-blue-900/20 text-blue-400 rounded-md border border-blue-500/20">{b}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-6">
                     <p className="text-slate-500 font-system text-sm uppercase italic tracking-widest">Atualmente sem afiliação de guilda detectada.</p>
                     <p className="text-[11px] text-slate-700 max-w-md mx-auto leading-relaxed">"Hunters solitários carregam o peso total do mundo em seus ombros. Considere unir-se a uma guilda para acessar benefícios de Rank e missões de suporte."</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'ARMY' && (
          <div className="max-w-5xl mx-auto animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h3 className="text-2xl font-system font-black text-blue-500 uppercase tracking-[0.3em]">Exército de Sombras</h3>
                    <p className="text-xs text-slate-500 font-system uppercase tracking-widest mt-1">Soberano: {hunter.name}</p>
                </div>
                <div className="bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-6 shadow-2xl">
                    <div className="text-center">
                        <p className="text-[9px] text-slate-500 uppercase mb-1">Capacidade de Sombras</p>
                        <p className="text-xl font-system font-black text-blue-400">{hunter.shadows.length} / {Math.floor(hunter.stats.intelligence / 2)}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-800"></div>
                    <div className="text-center">
                        <p className="text-[9px] text-slate-500 uppercase mb-1">Rank Médio</p>
                        <p className="text-xl font-system font-black text-slate-300">D</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hunter.shadows.length > 0 ? hunter.shadows.map((shadow) => (
                <div key={shadow.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl group hover:border-blue-600 transition-all shadow-2xl relative overflow-hidden flex flex-col gap-4">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-125 transition-transform duration-700">👥</div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                        <span className={`text-[10px] font-system font-black px-2 py-0.5 rounded border ${rankColors[shadow.rank]} bg-slate-950/80`}>{shadow.rank}</span>
                        <h4 className="text-xl font-system font-black text-white uppercase mt-2 group-hover:text-blue-400 transition-colors">{shadow.name}</h4>
                        <p className="text-[10px] text-slate-500 font-system uppercase tracking-widest">{shadow.originalName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-system">LVL</p>
                        <p className="text-xl font-system font-black text-blue-500">{shadow.level}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px] font-system font-bold uppercase tracking-widest text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                    <span>Função: {shadow.role}</span>
                    <span className={shadow.active ? "text-blue-500 animate-pulse" : "text-slate-700"}>● Ativa</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center space-y-6 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                    <div className="text-6xl opacity-10">🌑</div>
                    <p className="text-slate-700 font-system italic uppercase tracking-[0.4em]">"Erga-se... mas ainda não há nada a ser erguido."</p>
                    <p className="text-[10px] text-slate-800 uppercase max-w-xs mx-auto">Vença inimigos poderosos e use a extração de sombras para iniciar seu exército.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'SOCIAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Contatos */}
            <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xs font-system font-black text-blue-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                    <span>📱</span> Lista de Contatos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hunter.contacts.length > 0 ? hunter.contacts.map((contact) => (
                    <div key={contact.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 group hover:border-blue-600 transition-all shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-system font-black text-white">{contact.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{contact.profession} • RANK {contact.rank}</p>
                            </div>
                            <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase ${contact.status === 'Ativo' ? 'border-green-800 text-green-500' : contact.status === 'Morto' ? 'border-red-900 text-red-700' : 'border-slate-800 text-slate-500'}`}>
                                {contact.status}
                            </span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="flex justify-between text-[9px] uppercase text-slate-500 mb-1">
                                <span>Amizade</span>
                                <span>{contact.friendship}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]`} style={{ width: 
                                    contact.friendship === FriendshipLevel.NEUTRO ? '20%' : 
                                    contact.friendship === FriendshipLevel.CONHECIDO ? '40%' :
                                    contact.friendship === FriendshipLevel.ALIADO ? '65%' :
                                    contact.friendship === FriendshipLevel.AMIGO ? '85%' : '100%'
                                }}></div>
                            </div>
                        </div>
                        <button 
                            disabled={contact.status === 'Morto'}
                            onClick={() => onCallContact(contact)}
                            className="w-full py-3 bg-blue-600/10 border border-blue-600/30 text-blue-500 font-system text-[10px] font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest active:scale-95 disabled:opacity-20"
                        >
                            Fazer Ligação
                        </button>
                    </div>
                    )) : (
                        <div className="col-span-full py-16 text-center text-slate-800 font-system italic uppercase tracking-[0.3em]">
                            Rede de contatos vazia.
                        </div>
                    )}
                </div>
            </div>

            {/* Registro do Mundo */}
            <div className="lg:col-span-5 space-y-6">
                <h3 className="text-xs font-system font-black text-blue-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                    <span>🌍</span> Registro do Mundo
                </h3>
                <div className="space-y-4">
                    {hunter.worldLog.length > 0 ? hunter.worldLog.map((event) => (
                        <div key={event.id} className="bg-slate-900/40 border-l-4 border-l-blue-600 border border-slate-800 p-5 rounded-r-2xl shadow-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-system text-slate-500 uppercase">{event.date}</span>
                                <span className={`text-[7px] font-black px-2 py-0.5 rounded border uppercase ${event.impact === 'Global' ? 'bg-red-950/20 border-red-900 text-red-500' : 'border-slate-800 text-slate-500'}`}>
                                    {event.impact}
                                </span>
                            </div>
                            <h4 className="text-md font-system font-black text-white mb-1">{event.title}</h4>
                            <p className="text-xs text-slate-400 font-serif leading-relaxed italic line-clamp-2">"{event.description}"</p>
                        </div>
                    )) : (
                        <div className="py-16 text-center text-slate-800 font-system italic uppercase tracking-[0.3em]">
                            O mundo segue em silêncio...
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatRow = ({ label, value }: { label: string, value: number }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-800/30 group">
    <span className="text-[10px] uppercase font-system text-slate-500 tracking-[0.3em] group-hover:text-blue-400 transition-colors">{label}</span>
    <span className="font-system font-black text-sm text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.15)]">{value}</span>
  </div>
);

const EquipSlot = ({ label, item, type, onDrop, onUnequip }: any) => (
  <div 
    onDrop={onDrop}
    onDragOver={(e) => e.preventDefault()}
    className={`w-24 h-24 md:w-28 md:h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all relative shadow-lg ${item ? 'border-blue-600 bg-blue-600/10 scale-105' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}`}
  >
    {item ? (
      <div className="flex flex-col items-center gap-1 group cursor-pointer w-full h-full justify-center p-2" onClick={onUnequip}>
        <span className="text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse">
            {type === 'Weapon' ? '⚔️' : type === 'Armor' ? '🛡️' : type === 'Helmet' ? '🪖' : type === 'Relic' ? '✨' : type === 'Accessory' ? '💍' : '🧪'}
        </span>
        <span className="text-[7px] md:text-[8px] text-center font-black px-1 uppercase max-w-full truncate text-slate-100">{item.name}</span>
        <div className="absolute inset-0 bg-red-900/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl backdrop-blur-sm">
           <span className="text-[9px] font-system font-black text-white uppercase tracking-widest">Desacoplar</span>
        </div>
      </div>
    ) : (
      <div className="text-center">
        <span className="text-[8px] md:text-[9px] text-slate-700 font-system font-bold uppercase tracking-widest">{label}</span>
        <p className="text-[6px] text-slate-800 uppercase mt-1">Vazio</p>
      </div>
    )}
  </div>
);

export default HunterSheet;
