import { Size } from './scripts/types/physics';
import Loader from './scripts/loader';
import MouseTracker from './scripts/controllers/mousetracker';

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
    const loader = new Loader(this.context);
    const mouser = new MouseTracker(this.canvas);
    loader.setup();
    mouser.setup();
    loader.boot();
  }
  // #endregion
}

const game = new Game();
game.boot();
