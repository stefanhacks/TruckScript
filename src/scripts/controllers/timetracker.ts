import DataManager from './datamanager';

export default class TimeTracker {
  // #region Vars
  public lastTimeCycle: number;

  private dataManager: DataManager;

  private syncedTimeCycle: number;
  // #endregion

  // #region Constructor
  public constructor(data: DataManager) {
    this.dataManager = data;
    this.lastTimeCycle = Date.now();
    this.syncTime();
    this.setIntervals();
  }
  // #endregion

  /**
   * Calls API to sync time with UTC. Experiment into cheating detection, WIP - needs work.
   */
  private async syncTime(): Promise<void> {
    const response = await fetch('http://worldclockapi.com/api/json/utc/now');
    if (response.status === 200) {
      const data = (await response.json()) as Record<string, unknown>;
      this.syncedTimeCycle = data.currentFileTime as number;
    }
  }

  /**
   * Readies time interval events in the window component.
   */
  public setIntervals(): void {
    window.setInterval(() => this.tickTime(), 1000);
    window.setInterval(() => this.dataManager.save(), 15000);
  }

  /**
   * Calls DataManager to account for a second.
   */
  private tickTime(): void {
    this.lastTimeCycle = Date.now();
    this.dataManager.manageSecond();
  }
  // #endregion
}
