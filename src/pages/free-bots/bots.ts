import { openXmlInBotBuilder } from '@/nexus/open-bot';

/** Tier by power index (structure only: strategy depth, stake scaling, digit statistics; not a profit forecast). */
const TIERS = [
    { min: 75, name: 'APEX', c1: '#ff9d4d', c2: '#ff4d6d' },
    { min: 55, name: 'ELITE', c1: '#b04dff', c2: '#ff4dd2' },
    { min: 38, name: 'PRO', c1: '#4de2ff', c2: '#4d7bff' },
    { min: 0, name: 'ROOKIE', c1: '#2be3a0', c2: '#4de2ff' },
];

/**
 * The bot files are large, so they load only when a bot is opened. Type and power were worked out from each file
 * once (power = strategy depth + stake-scaling + digit-statistics logic, 0-100); update them if you edit a bot.
 */
const SOURCES = [
    { title: 'Dollar Hunter', about: 'Over bot that scales its stake as it trades. Open it to see and tweak the rules.', types: ['Over'], power: 35, load: () => import('./bots/dollar-hunter.xml') },
    { title: 'Nexus', about: 'Over bot built around last-digit statistics. Open it to see and tweak the rules.', types: ['Over'], power: 35, load: () => import('./bots/nexus.xml') },
    { title: 'Over 2', about: 'Over bot with stake scaling and digit-statistics logic. Open it to see and tweak the rules.', types: ['Over'], power: 99, load: () => import('./bots/over-2.xml') },
    { title: 'Under 8 Pro (recovery Under 5)', about: 'Trades Under 8 and, after a loss, recovers with Under 5 until it wins.', types: ['Under'], power: 46, load: () => import('./bots/under-8-pro.xml') },
    // Smart bots: they change what they trade while running (need the Switch trade / Purchase any / Digit chance blocks)
    { title: 'Even, recover Odd', about: 'Trades Even. After a loss it switches to Odd until a win, then goes back to Even. Stake grows after losses and resets on a win.', types: ['Even'], power: 58, load: () => import('./bots/even-recover-odd.xml') },
    { title: 'Over 3, smart recovery (Even or Odd by probability)', about: 'Trades Over 3. After a loss it looks at recent ticks and recovers with Even or Odd, whichever has been appearing more.', types: ['Over'], power: 72, load: () => import('./bots/over-3-smart-recovery.xml') },
    { title: 'Probability Picker (Even / Odd)', about: 'Before every trade it checks the last 100 ticks and buys Even or Odd, whichever has appeared more often.', types: ['Even'], power: 62, load: () => import('./bots/probability-picker.xml') },
    { title: 'Volatility Hopper (changes volatility on loss)', about: 'Trades Even and recovers with Odd. After a loss it also moves to the next volatility in its list, cycling round.', types: ['Even'], power: 78, load: () => import('./bots/volatility-hopper.xml') },
    { title: 'Under 7, recover Over / Under 4 by probability', about: 'Trades Under 7. After a loss it recovers with Over 4 or Under 4, whichever has appeared more in recent ticks.', types: ['Under'], power: 74, load: () => import('./bots/under-7-over-under.xml') },
    { title: 'Apex Adaptive (picks, recovers and hops)', about: 'Picks Even or Odd by recent frequency, recovers with Over/Under by probability, and changes volatility after repeated losses.', types: ['Even'], power: 92, load: () => import('./bots/apex-adaptive.xml') },
];

export const FREE_BOTS = SOURCES.map((s, i) => ({ n: i + 1, ...s, tier: TIERS.find(t => s.power >= t.min)! }));
export type FreeBot = (typeof FREE_BOTS)[number];

/** Opens a bundled bot in Bot Builder (loads its file first). */
export const openBot = async (bot: FreeBot): Promise<boolean> => openXmlInBotBuilder((await bot.load()).default, bot.title);
