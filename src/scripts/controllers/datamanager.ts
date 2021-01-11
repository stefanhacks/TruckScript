import { Business, Job, makeJob } from '../models/jobs';
import { newPlayer, PlayerData } from '../models/playerdata';
import { JOB_CYCLE } from './timetracker';

export default class DataManager {
  // #region Vars
  public playerData: PlayerData;

  public runningJobs: Array<Job<Business>>;

  public availableJobs: Map<Business, Job<Business>>;
  // #endregion

  // #region Constructor
  public constructor() {
    this.playerData = JSON.parse(window.localStorage.getItem('stTruckerSave'));
    if (this.playerData === null || this.playerData === undefined) this.playerData = newPlayer();

    this.readyJobs();
    this.save();
  }

  /**
   * Builds look up objects for every job key player data has.
   */
  private readyJobs(): void {
    this.runningJobs = [];
    this.availableJobs = new Map();

    const { jobStats } = this.playerData;
    Object.values(Business).forEach((key: string | Business) => {
      if (Number.isNaN(+key) === false) {
        const newJob = makeJob(+key);
        this.availableJobs.set(+key, newJob);
        if (jobStats[key] !== undefined && jobStats[key].managed === true) this.runningJobs.push(newJob);
      }
    });
  }
  // #endregion

  // #region Lifecycle: ~
  /**
   * Saves Player Data on local storage.
   */
  public save(): void {
    this.playerData.lastTime = Date.now();
    window.localStorage.setItem('stTruckerSave', JSON.stringify(this.playerData));
  }

  /**
   * Accounts for a time cycle, accounts for every running job.
   */
  public manageJobCycle(): void {
    let moneyMade = 0;
    const checkJobs = this.runningJobs;
    this.runningJobs = [];

    checkJobs.forEach((running: Job<Business>) => {
      moneyMade += this.manageJob(running);
    });

    this.playerData.money += moneyMade;
  }

  /**
   * Accounts a job cycle for a given job.
   * @param job Given JobType, will be looked up on player data.
   */
  private manageJob(job: Job<Business>): number {
    const { id, profit } = job;

    // Respective Player Job Data
    const playerJob = this.playerData.jobStats[id];
    playerJob.time -= JOB_CYCLE;

    // Money making Cycle.
    let moneyMade = 0;
    const { amount, managed, time } = playerJob;

    if (time <= 0) {
      moneyMade += profit * amount;
      if (managed === true) {
        playerJob.time = job.delay;
        this.runningJobs.push(job);
      }
    } else {
      this.runningJobs.push(job);
    }

    return moneyMade;
  }
  // #endregion
}
