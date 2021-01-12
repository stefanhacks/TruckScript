export enum Business {
  HotDog = 0,
  Newspaper = 1,
  Packages = 2,
  InterState = 3,
  Explosives = 4,
  Chemicals = 5,
  Military = 6,
}

export type Job<T> = {
  id: T;
  name: string;
  profit: number;
  buy: { initialPrice: number; increment: number };
  delay: number;
  cost: (amount: number) => number;
};

/**
 * Given an BusinessType ID, builds and returns a JobType for it.
 * @param id Desired BusinessType.
 */
export function makeJob<T extends Business>(id: T): Job<T> {
  /**
   * Delay: [2000, 2125, 2500, 3125, 5000, 13125, 32500]
   * Profit: [50, 160, 530, 1220, 2350, 7400, 221810]
   * Ratio: [100.0, 32.0, 10.4, 5.0, 3.4, 2.8, 0.16]
   */

  const delay = 2000 + 125 * id ** 2 + 1000 * Math.max(id - 3, 0) ** 3;
  const profit = 49 + 100 * id ** 2 + 10 * id ** 3 + 60 ** Math.max(id - 3, 0) + Math.floor(id / 4);
  const initialPrice = 10 + 190 * id + 250 ** Math.max(id - 1, 0) * 1000;
  const increment = initialPrice / 2;
  const name = Business[id];

  const cost = (amount: number) => initialPrice + increment * (amount - 1);

  const job: Job<T> = { id, name, profit, buy: { initialPrice, increment }, delay, cost };
  return job;
}
