import { VIEW_SIZE } from '../../game';
import MouseTracker from './mousetracker';
import DataManager from './datamanager';

import { Business, Job } from '../models/jobs';
import { PlayerData } from '../models/playerdata';
import { TITLE, LINE, MONEY, BUTTON_SIZE, LAYOUT, NAME, PROFIT, LOADING } from '../models/guielements';

import { Button, LabelElement, LineElement } from '../types/elements';
import { JOB_SHEET_COORDS, CarSheet } from '../utils/imagebundler';
import { BoundingBox, Size, Vector2 } from '../types/physics';

export default class GUI {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private mouseTracker: MouseTracker;

  private dataManager: DataManager;
  // #endregion

  private canvas: HTMLCanvasElement;

  // #region Constructor
  public constructor(canvas: HTMLCanvasElement, mouseTracker: MouseTracker, dataManager: DataManager) {
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    this.mouseTracker = mouseTracker;
    this.dataManager = dataManager;

    this.writeText(this.context, LOADING, { x: VIEW_SIZE.width / 2, y: VIEW_SIZE.height / 2 });
    window.onresize = () => this.resize();
  }

  /**
   * Window resize callback. Resizes canvas according to inner dimensions.
   */
  private resize(): void {
    // Reset context to identity.
    this.context.setTransform();
    const { innerWidth, innerHeight } = window;

    /**
     * Somewhat arbitrary values, but tested on some major
     * devices, such as iPhones, Moto G and Galaxy models.
     */
    let scaleRatio = 1;
    if (innerWidth < 650 || innerHeight < 350) scaleRatio = 3;
    else if (innerWidth < 760 || innerHeight < 600) scaleRatio = 1.8;

    this.canvas.width = 720 / scaleRatio;
    this.canvas.height = 600 / scaleRatio;
    this.context.scale(1 / scaleRatio, 1 / scaleRatio);
    this.drawGUI(this.dataManager.playerData);
  }
  // #endregion

  // #region Draw Methods
  /**
   * Clears context.
   */
  private clearContext(): void {
    const { width, height } = VIEW_SIZE;
    this.context.clearRect(0, 0, width, height);
  }

  public setToGame(): void {
    this.drawGUI(this.dataManager.playerData, true);
  }

  /**
   * Cycle to draw all Gui Elements.
   * @param data PlayerData object, so player data may be fetched and drawn.
   * @param mapButtons Whether or not to map buttons to mouse tracker. Defaults to false.
   */
  public drawGUI(data: PlayerData, mapButtons = false): void {
    this.clearContext();

    this.drawLine(LINE);
    this.drawButtons(data, mapButtons);

    this.writeText(this.context, TITLE, { x: 20, y: 40 });
    this.writeText(this.context, MONEY, { x: 700, y: 40 }, (data.money / 100).toFixed(2));
  }
  // #endregion

  // #region Shapes
  /**
   * Given context and a text element type, draws text.
   * @param context Context to draw with.
   * @param text Typed element with text configuration.
   * @param position Where to write at.
   * @param append Optional string. Appends to end of content.
   */
  private writeText(
    context: CanvasRenderingContext2D,
    text: LabelElement,
    position: Vector2,
    append: string | number = ''
  ): void {
    const { content, fontSize, fontFamily, fillStyle, align } = text;

    const family = fontFamily !== undefined ? fontFamily : 'system-ui';
    const size = fontSize !== undefined ? fontSize : 20;

    context.font = `${size}px ${family}`;
    context.textAlign = align !== undefined ? align : 'left';
    context.fillStyle = fillStyle !== undefined ? fillStyle : 'white';

    context.fillText(content + append, position.x, position.y);
  }

  /**
   * Given a line element type, draws a line.
   * @param line Typed element with line configuration.
   */
  private drawLine(line: LineElement): void {
    const { fillStyle, start, end } = line;

    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.strokeStyle = fillStyle;
    this.context.stroke();
  }

  /**
   * Given PlayerData, draws all button elements.
   * @param player Typed element with PlayerData.
   * @param mapButtons Whether or not to map buttons to mouse tracker.
   */
  private drawButtons(player: PlayerData, mapButtons: boolean): void {
    this.dataManager.availableJobs.forEach((job: Job<Business>, key: Business) => {
      if (key in Business === true) this.drawButton(player, +key as Business, mapButtons);
    });
  }

  /**
   * Draws a single button for a given player/key combo.
   * @param player PlayerData object.
   * @param key Business key object, to which to draw with.
   * @param map Whether or not to map button to mouse tracker.
   */
  private drawButton(player: PlayerData, key: Business, map: boolean): void {
    const { anchor: layoutAnchor, span } = LAYOUT;

    const offset = BUTTON_SIZE.width + span.x;
    const oddOffset = Math.floor(key % 2) === 0 ? 0 : offset;
    const lastOffset = key === this.dataManager.availableJobs.size - 1 ? offset / 2 : 0;

    const x = layoutAnchor.x + oddOffset + lastOffset;
    const y = layoutAnchor.y + (BUTTON_SIZE.height + span.y) * Math.floor(key / 2);

    const position: Vector2 = { x, y };

    const boxAt: Vector2 = { x: x - lastOffset / 2, y };
    const size: Size = { width: BUTTON_SIZE.width + lastOffset, height: BUTTON_SIZE.height };

    this.drawBorder(boxAt, size);
    this.drawTruck(position, key);
    this.drawInfo(position, key, player, lastOffset);

    if (map === true) this.mapJobBox(boxAt, size, key);
  }

  /**
   * Draws a sprite after fetching it and its coordinates. Assumes sprite has been loaded.
   * @param position Vector2, position to draw it in.
   * @param key Business key to draw truck of.
   */
  private drawTruck(position: Vector2, key: Business): void {
    const { anchor, size } = JOB_SHEET_COORDS[key];
    const { srcOffset } = LAYOUT;
    this.context.drawImage(
      CarSheet.data,
      anchor.x,
      anchor.y,
      size.width,
      size.height,
      position.x + srcOffset.x,
      position.y + srcOffset.y,
      size.width,
      size.height
    );
  }

  /**
   * Possibly temporary, draws a gray border around button.
   * @param boxAt Where to start the box.
   * @param size Box dimensions.
   */
  private drawBorder(boxAt: Vector2, size: Size): void {
    const { x, y } = boxAt;
    const { width, height } = size;

    this.context.beginPath();
    this.context.rect(x, y, width, height);
    this.context.stroke();
  }

  /**
   * Draws Business and player information for a given key.
   * @param position Vector2, position to draw it in.
   * @param key Business key to draw info of.
   * @param player PlayerData object.
   * @param offset Adds to button's horizontal position.
   */
  private drawInfo(position: Vector2, key: Business, player: PlayerData, offset: number): void {
    const { nameOffset, profitOffset } = LAYOUT;
    const jobInfo = this.dataManager.availableJobs.get(key);

    const namePos = { x: position.x + nameOffset.x + offset / 2, y: position.y + nameOffset.y };
    this.writeText(this.context, NAME, namePos, jobInfo.name);

    const profitPosition = { x: position.x + profitOffset.x + offset / 2, y: position.y + profitOffset.y };
    const amount = player.jobStats[key] !== undefined ? player.jobStats[key].amount : 0;
    const profit = `${jobInfo.profit} × ${amount}`;
    this.writeText(this.context, PROFIT, profitPosition, profit);
  }

  /**
   * Maps a box to a datamanager click.
   * @param boxAt Point where box starts.
   * @param size Size of the box.
   * @param key Business key to map.
   */
  private mapJobBox(boxAt: Vector2, size: Size, key: Business): void {
    const callback = () => this.dataManager.treatClick(key);

    const box: BoundingBox = [boxAt, { x: boxAt.x + size.width, y: boxAt.y + size.height }];
    const button: Button = { box, callback };
    this.mouseTracker.addListener(button);
  }
  // #endregion
}
