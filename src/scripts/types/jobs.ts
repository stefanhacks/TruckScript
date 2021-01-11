export enum BusinessType {
  Newspaper = 0,
  Mail = 1,
  InterState = 2,
  LongDistance = 3,
  Fragile = 4,
  Chemicals = 5,
  Military = 6,
}

export type JobType<T> = {
  id: T;
  profit: number;
  buy: { initialPrice: number; increment: number };
  delay: { max: number; current?: number };
};

/**
 * Given an BusinessType ID, builds and returns a JobType for it.
 * @param id Desired BusinessType.
 */
export function makeJob<T extends BusinessType>(id: T): JobType<T> {
  const max = 5000 + 250 * id + 100 ** Math.max(id - 3, 0);
  const profit = 3 + 10 ** Math.max(id - 1, 0) + 10 ** Math.max(id - 3, 0);
  const initialPrice = 10 + 190 * id + 250 ** Math.max(id - 1, 0);
  const increment = initialPrice / 2;

  const job: JobType<T> = { id, profit, buy: { initialPrice, increment }, delay: { max } };
  return job;
}
