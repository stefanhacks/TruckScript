import { BusinessType, JobType, makeJob } from '../types/jobs';
import { newPlayer, PlayerData } from '../types/playerdata';

export default class DataManager {
  // #region Vars
  public data: PlayerData;

  public runningJobs: Map<BusinessType, JobType<BusinessType>>;
  // #endregion

  // #region Lifecycle: 0
  public constructor() {
    this.data = JSON.parse(window.localStorage.getItem('stTruckerSave'));
    if (this.data === null || this.data === undefined) this.data = newPlayer();

    this.readyJobs();
    this.save();
  }

  /**
   * Builds look up objects for every job key player data has.
   */
  private readyJobs(): void {
    this.runningJobs = new Map();
    const { jobs } = this.data;
    for (const key in jobs) {
      if (key in [BusinessType] && jobs[key] !== undefined) {
        this.runningJobs[key] = makeJob(+key);
      }
    }
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
   * Accounts for a time cycle, accounts for every running job.
   */
  public manageSecond(): void {
    let moneyMade = 0;
    for (const key in this.runningJobs) {
      if (key in [BusinessType]) {
        const { amount } = this.data.jobs[key];
        const job: JobType<BusinessType> = this.runningJobs[key];
        moneyMade += job.profit * amount;
      }
    }

    this.data.money += moneyMade;
  }
  // #endregion
}
