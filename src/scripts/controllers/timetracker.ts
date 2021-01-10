import { Bootable } from '../types/interfaces';
import DataManager from './datamanager';

export default class TimeTracker implements Bootable {
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
  }
  // #endregion

  /**
   * Calls API to sync time with UTC. Experiment into cheating detection, WIP - needs work.
   */
  private async syncTime(): Promise<void> {
    const response = await fetch('http://worldclockapi.com/api/json/utc/now');
    if (response.status === 200) {
      const data = await response.json();
      this.syncedTimeCycle = ((data as unknown) as Record<string, unknown>).currentFileTime as number;
    }
  }
  // #endregion

  // #region Lifecycle: 0
  public boot(): void {
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
