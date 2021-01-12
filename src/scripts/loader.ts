import { BGSheet, CarSheet, EmoteSheet } from './utils/imagebundler';

export default class Loader {
  // #region Vars
  private context: CanvasRenderingContext2D;

  // #endregion

  // #region Constructor
  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
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
