import { CarSheet } from './utils/imagebundler';

export default class Loader {
  // #region Vars
  private context: CanvasRenderingContext2D;

  // #endregion

  // #region Constructor
  public constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
  }

  /**
   * Actually loads assets.
   */
  public async doLoad(): Promise<void> {
    return new Promise((resolve) => {
      const carSheet = new Image();

      carSheet.onload = () => {
        CarSheet.data = carSheet;
        resolve();
      };

      carSheet.src = CarSheet.url;
    });
  }
  // #endregion
}
