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

  private timer: TimeTracker;

  private loader: Loader;

  private mouser: MouseTracker;

  // #endregion
  private gui: GUI;

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
    this.timer = new TimeTracker(data);

    this.loader = new Loader(this.context);
    this.mouser = new MouseTracker(this.canvas);
    this.gui = new GUI(this.context, this.mouser);

    this.loader.doLoad().then(() => this.gui.drawGUI());
  }
  // #endregion
}

const game = new Game();
game.boot();
