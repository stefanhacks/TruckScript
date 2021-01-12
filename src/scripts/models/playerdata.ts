import { Business } from './jobs';

export type JobStats = {
  amount: number;
  managed: boolean;
  time?: number;
};

export type PlayerData = {
  money: number;
  lastTime: number;
  jobStats: { [id in Business]?: JobStats };
};

/**
 * Returns a PlayerData object for a brand new player.
 */
export function newPlayer(): PlayerData {
  return {
    money: 0,
    lastTime: Date.now(),
    jobStats: { [Business.HotDog]: { amount: 1, managed: false } },
  } as PlayerData;
}
