import { VIEW_SIZE } from '../game';

export default class Loader {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private labelSpecs: Record<string, string> = {
    font: '20px system-ui',
    fillStyle: 'white',
  };
  // #endregion

  // #region Constructor
  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.makeLabel();
    this.doLoad();
  }

  /**
   * Makes the loading label.
   */
  private makeLabel(): void {
    const { font, fillStyle } = this.labelSpecs;
    this.context.font = font;
    this.context.fillStyle = fillStyle;
    this.context.textAlign = 'center';

    const { width, height } = VIEW_SIZE;
    this.context.fillText(`loading...`, width / 2, height / 2);
  }

  /**
   * Actually loads assets.
   */
  public doLoad(): void {
    //
  }
  // #endregion
}
