
import { Rank, Stats, PhysicalCondition } from './types';

export const INITIAL_STATS: Stats = {
  strength: 10,
  agility: 10,
  perception: 10,
  vitality: 10,
  intelligence: 10
};

export const PHYSICAL_CONDITION_MODIFIERS: Record<PhysicalCondition, number> = {
  [PhysicalCondition.FRAGILE]: 0.7,
  [PhysicalCondition.BELOW_AVERAGE]: 0.9,
  [PhysicalCondition.NORMAL]: 1.0,
  [PhysicalCondition.FIT]: 1.2,
  [PhysicalCondition.ATHLETE]: 1.5,
  [PhysicalCondition.EXCEPTIONAL]: 2.0
};

// Probabilidades atualizadas (Patch Oficial)
export const RANK_CHANCES = {
  [Rank.S]: 5.0,   // 5%
  [Rank.A]: 10.0,  // 10%
  [Rank.B]: 15.0,  // 15%
  [Rank.C]: 20.0,  // 20%
  [Rank.D]: 22.0,  // 22%
  [Rank.E]: 28.0   // 28%
};

export const RANK_MULTIPLIERS = {
  [Rank.E]: 1.0,
  [Rank.D]: 1.5,
  [Rank.C]: 2.5,
  [Rank.B]: 5.0,
  [Rank.A]: 10.0,
  [Rank.S]: 50.0
};

export const SYSTEM_BLUE = '#3b82f6';
export const SYSTEM_DARK = '#020617';
