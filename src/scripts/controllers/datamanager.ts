import { PlayerData } from '../types/playerdata';

export default class DataManager {
  // #region Vars
  public data: PlayerData;
  // #endregion

  // #region Lifecycle: 0
  public constructor() {
    this.data = JSON.parse(window.localStorage.getItem('stTruckerSave'));
    if (this.data === null || this.data === undefined) this.data = { money: 0 };

    this.save();
  }
  // #endregion

  // #region Lifecycle: ~
  /**
   * Saves Player Data on local storage.
   */
  public save(): void {
    window.localStorage.setItem('stTruckerSave', JSON.stringify(this.data));
  }

  /**
   * Accounts for a time cycle.
   */
  public manageSecond(): void {
    this.data.money += 1;
  }
  // #endregion
}
