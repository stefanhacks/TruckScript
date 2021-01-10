export type PlayerData = {
  money: number;
  [id: number]: {
    moneyPerClick: number;
  };
};
