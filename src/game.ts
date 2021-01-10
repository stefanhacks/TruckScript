import { Size } from './scripts/types/physics';
import Loader from './scripts/loader';

export const VIEW_SIZE: Size = { width: 720, height: 600 };

export class Game {
  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  public constructor() {
    this.canvas = document.querySelector('#game') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
  }

  public async run(): Promise<void> {
    const loader = new Loader(this.context);
    loader.doLoad();
  }
}

const game = new Game();
game.run();
