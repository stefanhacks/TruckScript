import { VIEW_SIZE } from '../game';
import { TextElement } from './types/elements';
import { drawText } from './utils/draw';
import { SpriteSheet } from './utils/imagebundler';

export default class Loader {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private labelSpecs: TextElement = {
    content: 'loading...',
    font: '20px system-ui',
    align: 'center',
    fillStyle: 'white',
    position: { x: VIEW_SIZE.width / 2, y: VIEW_SIZE.height / 2 },
  };
  // #endregion

  // #region Constructor
  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.makeLabel();
  }

  /**
   * Makes the loading label.
   */
  private makeLabel(): void {
    drawText(this.context, this.labelSpecs);
  }

  /**
   * Actually loads assets.
   */
  public async doLoad(): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = SpriteSheet.url;
      img.onload = () => {
        SpriteSheet.data = img;
        resolve();
      };
    });
  }
  // #endregion
}
