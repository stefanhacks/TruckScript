import { VIEW_SIZE } from '../game';
import { LabelElement } from './types/elements';
import writeText from './utils/write';
import { BGSheet, CarSheet, EmoteSheet } from './utils/imagebundler';

export default class Loader {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private labelSpecs: LabelElement = {
    content: 'loading...',
    fontSize: 20,
    fontFamily: 'system-ui',
    align: 'center',
    fillStyle: 'white',
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
    writeText(this.context, this.labelSpecs, { x: VIEW_SIZE.width / 2, y: VIEW_SIZE.height / 2 });
  }

  /**
   * Actually loads assets.
   */
  public async doLoad(): Promise<void> {
    return new Promise((resolve) => {
      const bgSheet = new Image();
      const carSheet = new Image();
      const emoteSheet = new Image();

      bgSheet.onload = () => {
        BGSheet.data = bgSheet;
        if (CarSheet.data !== undefined && EmoteSheet.data !== undefined) resolve();
      };

      carSheet.onload = () => {
        CarSheet.data = carSheet;
        if (BGSheet.data !== undefined && EmoteSheet.data !== undefined) resolve();
      };

      emoteSheet.onload = () => {
        EmoteSheet.data = bgSheet;
        if (BGSheet.data !== undefined && CarSheet.data !== undefined) resolve();
      };

      bgSheet.src = BGSheet.url;
      carSheet.src = CarSheet.url;
      emoteSheet.src = EmoteSheet.url;
    });
  }
  // #endregion
}
