export enum BusinessType {
  Newspaper = 0,
  HotDog = 1,
  Packages = 2,
  InterState = 3,
  Fragile = 4,
  Chemicals = 5,
  Military = 6,
}

export type JobType<T> = {
  id: T;
  profit: number;
  buy: { initialPrice: number; increment: number };
  delay: number;
};

/**
 * Given an BusinessType ID, builds and returns a JobType for it.
 * @param id Desired BusinessType.
 */
export function makeJob<T extends BusinessType>(id: T): JobType<T> {
  const delay = 4999 + 2500 * id + 1000 ** Math.max(id - 3, 0);
  const profit = 3 + 10 ** Math.max(id - 1, 0) + 10 ** Math.max(id - 3, 0);
  const initialPrice = 10 + 190 * id + 250 ** Math.max(id - 1, 0);
  const increment = initialPrice / 2;

  const job: JobType<T> = { id, profit, buy: { initialPrice, increment }, delay };
  return job;
}
