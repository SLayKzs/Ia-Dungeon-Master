
export enum Rank {
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S'
}

export enum GameMode {
  NORMAL = 'NORMAL',
  HARDCORE = 'HARDCORE',
  IRONMAN = 'IRONMAN'
}

export enum Platform {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP'
}

export type HunterClass = 'Fighter' | 'Assassin' | 'Mage' | 'Tank' | 'Ranger' | 'Support';
export type NarrativeStyle = 'Simplified' | 'Detailed';

export enum WealthFactor {
  POBRE = 'Pobre',
  CLASSE_MEDIA = 'Classe Média',
  RICO = 'Rico'
}

export enum PhysicalCondition {
  FRAGILE = 'Frágil',
  BELOW_AVERAGE = 'Abaixo da média',
  NORMAL = 'Normal',
  FIT = 'Boa forma',
  ATHLETE = 'Atleta',
  EXCEPTIONAL = 'Excepcional'
}

export enum GuildRank {
  RECRUTA = 'Recruta',
  MEMBRO = 'Membro',
  VETERANO = 'Veterano',
  ELITE = 'Elite',
  PILAR = 'Pilar'
}

export enum FriendshipLevel {
  NEUTRO = 'Neutro',
  CONHECIDO = 'Conhecido',
  ALIADO = 'Aliado',
  AMIGO = 'Amigo',
  CONFIDENTE = 'Confidente'
}

export interface Guild {
  id: string;
  name: string;
  rank: Rank;
  description: string;
  benefits: string[];
  reputation: number;
  playerRank?: GuildRank;
}

export interface Contact {
  id: string;
  name: string;
  profession: string;
  rank: Rank;
  friendship: FriendshipLevel;
  lastInteraction?: string;
  status: 'Ativo' | 'Em Missão' | 'Morto' | 'Rival';
}

export interface WorldEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: 'Global' | 'Local' | 'Pessoal';
}

export interface Stats {
  strength: number;
  agility: number;
  perception: number;
  vitality: number;
  intelligence: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'Weapon' | 'Armor' | 'Helmet' | 'Relic' | 'Consumable' | 'Material' | 'ManaStone' | 'Accessory' | 'Support';
  rank: Rank;
  bonusStats?: Partial<Stats>;
  description?: string;
  value: number;
  weight: number;
  specialEffect?: string;
}

export interface Shadow {
  id: string;
  name: string;
  originalName: string;
  rank: Rank;
  level: number;
  role: 'Offensive' | 'Defensive' | 'Support';
  active: boolean;
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  helmet?: Item;
  relic?: Item;
  accessory?: Item;
  support?: Item;
}

export interface AwakeningHistory {
  date: string;
  originalRank: Rank;
  reawakened: boolean;
  reawakeningDate?: string;
  oldRank?: Rank;
  newRank?: Rank;
  statsBefore?: Stats;
  statsAfter?: Stats;
}

export interface Hunter {
  name: string;
  age: number;
  class: HunterClass;
  rank: Rank;
  level: number;
  exp: number;
  nextLevelExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: Stats;
  statPoints: number;
  gold: number;
  luck: number; // 1-100
  physicalCondition: PhysicalCondition;
  inventory: Item[];
  equipment: Equipment;
  shadows: Shadow[];
  status: string[];
  contacts: Contact[];
  worldLog: WorldEvent[];
  awakeningHistory?: AwakeningHistory;
  wealthFactor?: WealthFactor;
  personalObjective?: string;
  guild?: Guild | null;
  guildHistory: string[];
  avatarUrl?: string;
}

export interface GameState {
  hunter: Hunter | null;
  mode: GameMode;
  platform: Platform | null;
  narrativeStyle: NarrativeStyle;
  currentScene: string;
  history: Array<{ role: 'user' | 'system', text: string }>;
  isAwakened: boolean;
  activeGate: string | null;
}

export interface DMResponse {
  narrative: string;
  options: string[];
  updates?: Partial<Hunter> & { 
    guildInvitation?: Guild | null,
    newContact?: Contact,
    worldEvent?: WorldEvent
  };
  events?: string[];
}
