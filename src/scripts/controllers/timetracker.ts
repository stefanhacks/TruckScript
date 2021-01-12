import DataManager from './datamanager';

export const JOB_CYCLE = 1000;

export const SAVE_CYCLE = 5000;

export const SYNC_TIMEOUT = 3000;

export default class TimeTracker {
  // #region Vars
  private dataManager: DataManager;

  private subscribers: Array<(delta: number) => void>;
  // #endregion

  // #region Constructor
  public constructor(dataManager: DataManager) {
    this.dataManager = dataManager;
    this.subscribers = [];
  }

  /**
   * Syncs game with passed time offline.
   */
  public syncTime(): void {
    const { lastTime } = this.dataManager.playerData;
    const oldTime = lastTime !== undefined ? lastTime : new Date().getTime();
    const newTime = new Date().getTime();
    const delta = newTime - oldTime;

    this.dataManager.playerData.lastTime = newTime;
    this.tickTime(delta);
  }

  // #endregion

  // #region Lifecycle: ~
  /**
   * Readies time interval events in the window component.
   */
  public startTicking(): void {
    window.setInterval(() => this.tickTime(), JOB_CYCLE);
    window.setInterval(() => this.dataManager.save(), SAVE_CYCLE);
  }

  /**
   * Calls DataManager to account for a Job Cycle.
   * @param delta How many milliseconds to account for. Defaults to JOB_CYCLE.
   */
  private tickTime(delta = JOB_CYCLE): void {
    this.subscribers.forEach((callback: (delta: number) => void) => callback(delta));
  }

  /**
   * Adds a subscriber that is called every time a Job Cycle passes.
   * @param callback Function to call after a Job Cycle.
   */
  public addSubscriber(callback: (delta: number) => void): void {
    this.subscribers.push(callback);
  }
  // #endregion
}
