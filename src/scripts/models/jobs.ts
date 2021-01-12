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
  autoCost: number;
  cost: (amount: number) => number;
};

/**
 * Given an BusinessType ID, builds and returns a JobType for it.
 * @param id Desired BusinessType.
 */
export function makeJob<T extends Business>(id: T): Job<T> {
  /**
   * Price: [10, 90, 540, 1840, 4710, 18510, 665440]
   *
   * Delay: [2000, 3250, 7000, 13250, 23000, 41250, 74000]
   * Profit: [50, 160, 530, 1220, 2350, 7400, 221810]
   */

  const delay = 2000 + 1250 * id ** 2 + 1000 * Math.max(id - 3, 0) ** 3;
  const profit = (49 + 100 * id ** 2 + 10 * id ** 3 + 60 ** Math.max(id - 3, 0) + Math.floor(id / 4)) * 100;
  const initialPrice = 1000 + (profit * id) / 2;
  const increment = initialPrice / 2;
  const name = Business[id];
  const auto = (2000 + 2000 * id ** 2) * 100;

  const cost = (amount: number) => initialPrice + increment * amount;

  const job: Job<T> = { id, name, profit, buy: { initialPrice, increment }, autoCost: auto, delay, cost };
  return job;
}
