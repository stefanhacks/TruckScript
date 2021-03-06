import { ButtonType } from '../types/elements';
import { Business, Job, makeJob } from '../models/jobs';
import { newPlayer, PlayerData } from '../models/playerdata';

export default class DataManager {
  // #region Vars
  public playerData: PlayerData;

  public runningJobs: Array<Job<Business>>;

  public availableJobs: Map<Business, Job<Business>>;
  // #endregion

  // #region Constructor
  public constructor() {
    this.playerData = JSON.parse(window.localStorage.getItem('stTruckerSave'));
    if (this.playerData === null || this.playerData === undefined) {
      this.playerData = newPlayer();
      this.save();
    }

    this.readyJobs();
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
        if (jobStats[key] !== undefined && (jobStats[key].managed === true || jobStats[key].time > 0))
          this.runningJobs.push(newJob);
      }
    });
  }
  // #endregion

  // #region Lifecycle: ~
  /**
   * Saves Player Data on local storage.
   */
  public save(): void {
    this.playerData.lastTime = new Date().getTime();
    window.localStorage.setItem('stTruckerSave', JSON.stringify(this.playerData));
  }

  /**
   * Accounts for a time cycle, accounts for every running job.
   * @param delta How many milliseconds to account for.
   */
  public manageJobCycle(delta: number): void {
    let moneyMade = 0;
    const checkJobs = this.runningJobs;
    this.runningJobs = [];

    checkJobs.forEach((running: Job<Business>) => {
      moneyMade += this.manageJob(running, delta);
    });

    this.playerData.money += moneyMade;
  }

  /**
   * Accounts a job cycle for a given job.
   * @param job Given JobType, will be looked up on player data.
   * @param delta How many milliseconds to account for.
   */
  private manageJob(job: Job<Business>, delta: number): number {
    // Respective Player Job Data
    const { id, profit, delay } = job;
    const playerJob = this.playerData.jobStats[id];
    const { amount, managed, time } = playerJob;

    // Money making Cycle.
    const timer = time - delta;
    playerJob.time = Math.max(timer, 0);
    let moneyMade = 0;

    // If enough timer has passed,
    if (timer <= 0) {
      // To figure out how many cycles have been run we need to check if:
      // a)  Job is managed and b) There was enough time for another cycle.
      const cycles = managed === false && timer < -delay ? 1 + Math.floor(Math.abs(timer) / delay) : 1;
      moneyMade += profit * amount * cycles;

      if (managed === true) {
        playerJob.time = job.delay;
        this.runningJobs.push(job);
      }
    } else {
      this.runningJobs.push(job);
    }

    return moneyMade;
  }

  /**
   * Treats a click in one of the job buttons.
   * @param key Business key of the button pressed.
   * @param type ButtonType that was clicked.
   */
  public treatClick(key: Business, type: ButtonType): void {
    switch (type) {
      case ButtonType.Run:
        this.runClick(key);
        break;
      case ButtonType.Buy:
        this.buyClick(key);
        break;
      case ButtonType.Auto:
        this.autoClick(key);
        break;
      // no default
    }
  }

  /**
   * Treats a click on the run area.
   * @param key Business key of the button pressed.
   */
  private runClick(key: Business): void {
    const playerJob = this.playerData.jobStats[key];
    if (playerJob !== undefined) {
      const { managed, time } = playerJob;
      if (managed !== true && (time === undefined || time <= 0)) this.addRunningJob(key);
    }
  }

  /**
   * Treats a click on the buy area.
   * @param key Business key of the button pressed.
   */
  private buyClick(key: Business): void {
    const playerJob = this.playerData.jobStats[key];
    const { cost } = this.availableJobs.get(key);
    const amount = playerJob === undefined ? 0 : playerJob.amount;

    const total = cost(amount);

    if (this.playerData.money >= total) {
      if (playerJob === undefined) this.playerData.jobStats[key] = { amount: 1, managed: false };
      else playerJob.amount += 1;

      this.playerData.money -= total;
    }
  }

  /**
   * Treats a click on the auto area.
   * @param key Business key of the button pressed.
   */
  private autoClick(key: Business): void {
    const playerJob = this.playerData.jobStats[key];

    if (playerJob !== undefined) {
      const jobData = this.availableJobs.get(key);
      if (this.playerData.money >= jobData.autoCost) {
        playerJob.managed = true;
        this.playerData.money -= jobData.autoCost;
        this.addRunningJob(key);
      }
    }
  }

  /**
   * Adds a job to the running list.
   * @param key Business key of the job to run.
   */
  private addRunningJob(key: Business): void {
    const playerJob = this.playerData.jobStats[key];
    const jobData = this.availableJobs.get(key);

    playerJob.time = jobData.delay;
    this.runningJobs.push(jobData);
  }
  // #endregion
}
