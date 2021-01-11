import { BusinessType } from './jobs';

export type JobData = {
  amount: number;
  time?: number;
};

export type PlayerData = {
  money: number;
  lastTime: number;
  jobs: { [id in BusinessType]?: JobData };
};

/**
 * Returns a PlayerData object for a brand new player.
 */
export function newPlayer(): PlayerData {
  return {
    money: 0,
    lastTime: Date.now(),
    jobs: { [BusinessType.Newspaper]: { amount: 1 } },
  } as PlayerData;
}
