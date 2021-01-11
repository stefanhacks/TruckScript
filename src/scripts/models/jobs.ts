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
};

/**
 * Given an BusinessType ID, builds and returns a JobType for it.
 * @param id Desired BusinessType.
 */
export function makeJob<T extends Business>(id: T): Job<T> {
  /**
   * Delay: [5000, 5125, 5500, 6125, 8000, 16125, 36500]
   * Profit: [50, 160, 530, 1220, 2350, 7400, 221810]
   * Ratio: [100.0, 32.0, 10.4, 5.0, 3.4, 2.8, 0.16]
   */

  const delay = 5000 + 125 * id ** 2 + 1000 * Math.max(id - 3, 0) ** 3;
  const profit = 49 + 100 * id ** 2 + 10 * id ** 3 + 60 ** Math.max(id - 3, 0) + Math.floor(id / 4);
  const initialPrice = 10 + 190 * id + 250 ** Math.max(id - 1, 0);
  const increment = initialPrice / 2;
  const name = Business[id];

  const job: Job<T> = { id, name, profit, buy: { initialPrice, increment }, delay };
  return job;
}
