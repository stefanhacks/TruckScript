import { BusinessType, JobType, makeJob } from '../models/jobs';
import { newPlayer, PlayerData } from '../models/playerdata';
import { JOB_CYCLE } from './timetracker';

export default class DataManager {
  // #region Vars
  public playerData: PlayerData;

  public runningJobs: Array<JobType<BusinessType>>;

  public availableJobs: Map<BusinessType, JobType<BusinessType>>;
  // #endregion

  // #region Lifecycle: 0
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
    this.availableJobs = new Map();
    this.runningJobs = [];
    const { jobs } = this.playerData;
    for (const key in jobs) {
      if (key in [BusinessType] && jobs[key] !== undefined) {
        const newJob = makeJob(+key);
        this.availableJobs[key] = newJob;
        if (jobs[key].managed === true) this.runningJobs.push(newJob);
      }
    }
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
  public manageSecond(): void {
    let moneyMade = 0;
    const checkJobs = this.runningJobs;
    this.runningJobs = [];

    checkJobs.forEach((running: JobType<BusinessType>) => {
      moneyMade += this.manageJobCycle(running);
    });

    this.playerData.money += moneyMade;
  }

  /**
   * Accounts a job cycle for a given job.
   * @param job Given JobType, will be looked up on player data.
   */
  private manageJobCycle(job: JobType<BusinessType>): number {
    const { id, profit } = job;

    // Respective Player Job Data
    const playerJob = this.playerData.jobs[id];
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
