import { Vector2 } from '../types/physics';
import { Button } from '../types/elements';

export default class MouseTracker {
  // #region Vars
  private canvas: HTMLCanvasElement;

  private clickables: Array<Button>;
  // #endregion

  // #region Constructor
  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => this.mouseClick(e), false);
    this.clickables = [];
  }

  /**
   * Captures and figures out mouse clicks.
   * @param event MouseEvent, registered on the web page.
   */
  private mouseClick(event: MouseEvent): void {
    event.preventDefault();

    // Lil' math to account for canvas offset from page top/left.
    const canvasRect = this.canvas.getBoundingClientRect();
    const { x: canvasX, y: canvasY } = canvasRect;
    const { x: clientX, y: clientY } = event;

    const point: Vector2 = { x: clientX - canvasX, y: clientY - canvasY };
    this.checkClick(point);
  }

  /**
   * Given Vector2, checks if a button was registered that overlaps those coordinates.
   * @param point Vector2, coordinates to check buttons for.
   */
  private checkClick(point: Vector2) {
    const { x, y } = point;
    this.clickables.forEach((button: Button) => {
      const { box, callback } = button;
      const [start, end] = box;
      // Basic math to check if provided point lies within any buttons. Callback is called if so.
      if (x >= start.x && x < end.x) if (y >= start.y && y < end.y) callback();
    });
  }
  // #endregion

  // #region Lifecycle: ~
  /**
   * Given a button object, adds it to the listener array.
   * @param button Button to account for.
   */
  public addListener(button: Button): void {
    this.clickables.push(button);
  }

  /**
   * If provided button is present inside listener array, removes it.
   * @param button Button to remove.
   */
  public removeListener(button: Button): void {
    const i = this.clickables.indexOf(button);
    if (i !== -1) this.clickables.splice(i, 1);
  }
  // #endregion
}
