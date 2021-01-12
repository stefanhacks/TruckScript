import { Size } from './scripts/types/physics';
import Loader from './scripts/loader';
import MouseTracker from './scripts/controllers/mousetracker';
import TimeTracker from './scripts/controllers/timetracker';
import DataManager from './scripts/controllers/datamanager';
import GUI from './scripts/controllers/gui';

export const VIEW_SIZE: Size = { width: 720, height: 600 };

export class Game {
  // #region Vars
  private canvas: HTMLCanvasElement;

  private gui: GUI;
  // #endregion

  // #region Constructor
  public constructor() {
    this.canvas = document.querySelector('#game') as HTMLCanvasElement;
  }
  // #endregion

  // #region Lifecycle: ~
  /**
   * Runs the game.
   */
  public async boot(): Promise<void> {
    const data = new DataManager();
    const timer = new TimeTracker(data);

    const loader = new Loader(this.canvas);
    const mouser = new MouseTracker(this.canvas);
    this.gui = new GUI(this.canvas, mouser, data);

    loader.doLoad().then(() => {
      timer.addSubscriber((delta: number) => data.manageJobCycle(delta));
      timer.addSubscriber(() => this.gui.drawGUI(data.playerData));

      timer.syncTime();
      timer.startTicking();
      this.gui.setToGame();
    });
  }
  // #endregion
}

const game = new Game();
game.boot();
