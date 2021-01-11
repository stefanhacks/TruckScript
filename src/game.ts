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

  private context: CanvasRenderingContext2D;
  // #endregion

  // #region Constructor
  public constructor() {
    this.canvas = document.querySelector('#game') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
  }
  // #endregion

  // #region Lifecycle: ~
  /**
   * Runs the game.
   */
  public async boot(): Promise<void> {
    const data = new DataManager();
    const timer = new TimeTracker(data);

    const loader = new Loader(this.context);
    const mouser = new MouseTracker(this.canvas);
    const gui = new GUI(this.context, mouser, data);

    loader.doLoad().then(() => {
      timer.addSubscriber(() => data.manageJobCycle());
      timer.addSubscriber(() => gui.drawGUI(data.playerData));
      timer.startTicking();

      gui.drawGUI(data.playerData);
    });
  }
  // #endregion
}

const game = new Game();
game.boot();
