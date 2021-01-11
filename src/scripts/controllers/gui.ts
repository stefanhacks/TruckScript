import { drawLine, drawText } from '../utils/draw';
import { TITLE_SPECS, TITLE_LINE_SPECS } from '../models/guielements';
import { VIEW_SIZE } from '../../game';
import MouseTracker from './mousetracker';

export default class GUI {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private mouseTracker: MouseTracker;
  // #endregion

  // #region Constructor
  public constructor(context: CanvasRenderingContext2D, mouseTracker: MouseTracker) {
    this.context = context;
    this.mouseTracker = mouseTracker;
  }

  public drawGUI(): void {
    const { width, height } = VIEW_SIZE;
    this.context.clearRect(0, 0, width, height);

    drawText(this.context, TITLE_SPECS);
    drawLine(this.context, TITLE_LINE_SPECS);
  }
  // #endregion
}
