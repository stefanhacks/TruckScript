import { VIEW_SIZE } from '../../game';
import MouseTracker from './mousetracker';
import DataManager from './datamanager';

import { Business, Job } from '../models/jobs';
import { PlayerData } from '../models/playerdata';
import * as ELEMENT from '../models/guielements';

import { Button, ButtonType, LabelElement, LineElement } from '../types/elements';
import { JOB_SHEET_COORDS, CarSheet } from '../utils/imagebundler';
import { BoundingBox, Size, Vector2 } from '../types/physics';

export const GUI_REFRESH_CYCLE = 1000 / 20; // 20 fps

export default class GUI {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private mouseTracker: MouseTracker;

  private dataManager: DataManager;

  private lastClick: number;
  // #endregion

  private canvas: HTMLCanvasElement;

  // #region Constructor
  public constructor(canvas: HTMLCanvasElement, mouseTracker: MouseTracker, dataManager: DataManager) {
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    this.mouseTracker = mouseTracker;
    this.dataManager = dataManager;

    this.writeText(this.context, ELEMENT.LOADING, { x: VIEW_SIZE.width / 2, y: VIEW_SIZE.height / 2 });
    window.onresize = () => this.resize();

    window.setInterval(() => this.drawGUI(), GUI_REFRESH_CYCLE);
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
    this.drawGUI();
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
    this.drawGUI(true);
  }

  /**
   * Cycle to draw all Gui Elements.
   * @param data PlayerData object, so player data may be fetched and drawn.
   * @param mapButtons Whether or not to map buttons to mouse tracker. Defaults to false.
   */
  public drawGUI(mapButtons = false): void {
    const data = this.dataManager.playerData;
    this.clearContext();

    this.drawLine(ELEMENT.LINE);
    this.drawButtons(data, mapButtons);

    this.writeText(this.context, ELEMENT.TITLE, { x: 20, y: 40 });
    this.writeText(this.context, ELEMENT.MONEY, { x: 700, y: 40 }, (data.money / 100).toFixed(2));
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

    this.lastClick = null;
  }

  /**
   * Draws a single button for a given player/key combo.
   * @param player PlayerData object.
   * @param key Business key object, to which to draw with.
   * @param map Whether or not to map button to mouse tracker.
   */
  private drawButton(player: PlayerData, key: Business, map: boolean): void {
    const { anchor: layoutAnchor, span } = ELEMENT.LAYOUT;

    const offset = ELEMENT.BUTTON_SIZE.width + span.x;
    const oddOffset = Math.floor(key % 2) === 0 ? 0 : offset;
    const lastOffset = key === this.dataManager.availableJobs.size - 1 ? offset / 2 : 0;

    const x = layoutAnchor.x + oddOffset + lastOffset;
    const y = layoutAnchor.y + (ELEMENT.BUTTON_SIZE.height + span.y) * Math.floor(key / 2);

    const position: Vector2 = { x, y };

    const boxAt: Vector2 = { x: x - lastOffset / 2, y };
    const size: Size = { width: ELEMENT.BUTTON_SIZE.width + lastOffset, height: ELEMENT.BUTTON_SIZE.height };

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
    const { srcOffset } = ELEMENT.LAYOUT;
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
    const jobInfo = this.dataManager.availableJobs.get(key);
    const root = { x: position.x + offset / 2, y: position.y };
    this.drawName(root, jobInfo.name);

    const amount = player.jobStats[key] !== undefined ? player.jobStats[key].amount : 0;
    const profit = `${(jobInfo.profit / 100).toFixed()} × ${amount}`;
    this.drawProfit(root, profit);

    this.drawBuy(root, key, jobInfo.cost(amount));
    this.drawManager();
  }

  /**
   * Draws the business name.
   * @param root Anchor position of the job box.
   * @param name Name to draw.
   */
  private drawName(root: Vector2, name: string): void {
    const { nameOffset } = ELEMENT.LAYOUT;
    const namePos = { x: root.x + nameOffset.x, y: root.y + nameOffset.y };
    this.writeText(this.context, ELEMENT.NAME, namePos, name);
  }

  /**
   * Draws the profit label.
   * @param root Anchor position of the job box.
   * @param profit Value to draw.
   */
  private drawProfit(root: Vector2, profit: string): void {
    const { profitOffset } = ELEMENT.LAYOUT;
    const profitPosition = { x: root.x + profitOffset.x, y: root.y + profitOffset.y };
    this.writeText(this.context, ELEMENT.PROFIT, profitPosition, profit);
  }

  /**
   * Draws the buy button.
   * @param root Anchor position of the job box.
   * @param key Business key.
   * @param cost Cost to write.
   */
  private drawBuy(root: Vector2, key: Business, cost: number): void {
    const { down, up, forbidden } = ELEMENT.BUY_COLORS;
    let color = forbidden;
    if (cost < this.dataManager.playerData.money) color = this.lastClick === key ? down : up;

    const { buyOffset } = ELEMENT.LAYOUT;
    const buyPos = { x: root.x + buyOffset.x, y: root.y + buyOffset.y };
    this.writeText(this.context, ELEMENT.BUY, buyPos, `${(cost / 100).toFixed(2)}`);

    const { height } = ELEMENT.BUY_SIZE;
    const boxPos = { x: root.x + buyOffset.x + 5, y: root.y + buyOffset.y - height * 0.8 };
    this.context.fillStyle = color;
    this.context.fillRect(boxPos.x, boxPos.y, ELEMENT.BUY_SIZE.width, ELEMENT.BUY_SIZE.height);
    this.mapBuyBox(boxPos, ELEMENT.BUY_SIZE, key);

    const plusPos = { x: boxPos.x + 10, y: boxPos.y + 15 };
    this.writeText(this.context, ELEMENT.PLUS, plusPos);
  }

  private drawManager(): void {
    //
  }
  // #endregion

  // #region Click Mapping
  /**
   * Maps a box to a datamanager run click.
   * @param boxAt Point where box starts.
   * @param size Size of the box.
   * @param key Business key to map.
   */
  private mapJobBox(boxAt: Vector2, size: Size, key: Business): void {
    const callback = () => this.dataManager.treatClick(key, ButtonType.Run);

    const box: BoundingBox = [boxAt, { x: boxAt.x + size.width, y: boxAt.y + size.height }];
    const button: Button = { box, callback };
    this.mouseTracker.addListener(button);
  }

  /**
   * Maps a box to a datamanager buy click.
   * @param boxAt Point where box starts.
   * @param size Size of the box.
   * @param key Business key to map.
   */
  private mapBuyBox(boxAt: Vector2, size: Size, key: Business): void {
    const callback = () => {
      this.lastClick = key;
      this.dataManager.treatClick(key, ButtonType.Buy);
    };

    const box: BoundingBox = [boxAt, { x: boxAt.x + size.width, y: boxAt.y + size.height }];
    const button: Button = { box, callback };
    this.mouseTracker.addListener(button);
  }
  // #endregion
}
