import { VIEW_SIZE } from '../../game';
import MouseTracker from './mousetracker';
import DataManager from './datamanager';

import { Business, Job } from '../models/jobs';
import { JobStats } from '../models/playerdata';
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

  private canvas: HTMLCanvasElement;
  // #endregion

  // #region Constructor
  public constructor(canvas: HTMLCanvasElement, mouseTracker: MouseTracker, dataManager: DataManager) {
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    this.mouseTracker = mouseTracker;
    this.dataManager = dataManager;

    this.writeText(ELEMENT.LOADING, { x: VIEW_SIZE.width / 2, y: VIEW_SIZE.height / 2 });
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

  /**
   * Calls DrawGUI with the added callsign to map buttons.
   */
  public setToGame(): void {
    this.drawGUI(true);
  }
  // #endregion

  // #region Cycles
  /**
   * Clears context.
   */
  private clearContext(): void {
    const { width, height } = VIEW_SIZE;
    this.context.clearRect(0, 0, width, height);
  }

  /**
   * Cycle to draw all Gui Elements.
   * @param mapButtons Whether or not to map buttons to mouse tracker. Defaults to false.
   */
  public drawGUI(mapButtons = false): void {
    this.clearContext();

    this.drawLine(ELEMENT.LINE);
    this.drawButtons(mapButtons);

    const { money } = this.dataManager.playerData;
    this.writeText(ELEMENT.TITLE, { x: 20, y: 40 });
    this.writeText(ELEMENT.MONEY, { x: 700, y: 40 }, (money / 100).toFixed(2));
  }

  /**
   * Given PlayerData, draws all button elements.
   * @param mapButtons Whether or not to map buttons to mouse tracker.
   */
  private drawButtons(mapButtons: boolean): void {
    this.dataManager.availableJobs.forEach((job: Job<Business>, key: Business) => {
      if (key in Business === true) this.drawButton(+key as Business, mapButtons);
    });

    this.lastClick = null;
  }
  // #endregion

  // #region Basics
  /**
   * Given context and a text element type, draws text.
   * @param text Typed element with text configuration.
   * @param position Where to write at.
   * @param append Optional string. Appends to end of content.
   */
  private writeText(text: LabelElement, position: Vector2, append: string | number = ''): void {
    const { content, fontSize, fontFamily, fillStyle, align } = text;

    const family = fontFamily !== undefined ? fontFamily : 'system-ui';
    const size = fontSize !== undefined ? fontSize : 20;

    this.context.font = `${size}px ${family}`;
    this.context.textAlign = align !== undefined ? align : 'left';
    this.context.fillStyle = fillStyle !== undefined ? fillStyle : 'white';

    this.context.fillText(content + append, position.x, position.y);
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
  // #endregion

  // #region Button
  /**
   * Draws a single button for a given key.
   * @param key Business key object, to which to draw with.
   * @param map Whether or not to map button to mouse tracker.
   */
  private drawButton(key: Business, map: boolean): void {
    const { anchor: layoutAnchor, span } = ELEMENT.LAYOUT;

    const offset = ELEMENT.BUTTON_SIZE.width + span.x;
    const oddOffset = Math.floor(key % 2) === 0 ? 0 : offset;
    const lastOffset = key === this.dataManager.availableJobs.size - 1 ? offset / 2 : 0;

    const x = layoutAnchor.x + oddOffset + lastOffset;
    const y = layoutAnchor.y + (ELEMENT.BUTTON_SIZE.height + span.y) * Math.floor(key / 2);

    // Draw Sprites
    const position: Vector2 = { x, y };
    const boxAt: Vector2 = { x: x - lastOffset / 2, y };
    const size: Size = { width: ELEMENT.BUTTON_SIZE.width + lastOffset, height: ELEMENT.BUTTON_SIZE.height };

    this.drawBorder(boxAt, size);
    this.drawTruck(position, key);
    if (map === true) this.mapJobBox(boxAt, size, key);

    // Draw HUD
    const jobInfo = this.dataManager.availableJobs.get(key);
    const stats = this.dataManager.playerData.jobStats[key];
    const amount = stats !== undefined ? stats.amount : 0;
    const profit = `${(jobInfo.profit / 100).toFixed()} × ${amount}`;
    const infoPos = { x: position.x + lastOffset / 2, y: position.y };

    this.drawInfo(infoPos, jobInfo.name, profit);
    this.drawBuy(infoPos, key, jobInfo.cost(amount), map);
    this.drawAuto(infoPos, key, jobInfo.autoCost, stats, map);
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
   * @param root Vector2, position to draw it in.
   * @param name Business name to write.
   * @param profit Profit value to write..
   */
  private drawInfo(root: Vector2, name: string, profit: string): void {
    // Draw Name
    const { nameOffset } = ELEMENT.LAYOUT;
    const namePos = { x: root.x + nameOffset.x, y: root.y + nameOffset.y };
    this.writeText(ELEMENT.NAME, namePos, name);

    // Draw Profit
    const { profitOffset } = ELEMENT.LAYOUT;
    const profitPosition = { x: root.x + profitOffset.x, y: root.y + profitOffset.y };
    this.writeText(ELEMENT.PROFIT, profitPosition, profit);
  }
  // #endregion

  // #region Buy
  /**
   * Draws the buy button label and box for a given business.
   * @param root Vector2, position to draw it in.
   * @param key Business key for the given button.
   * @param cost Price to draw.
   * @param map Whether or not to map the button to a click area.
   */
  private drawBuy(root: Vector2, key: Business, cost: number, map: boolean): void {
    // Draw Buy Label
    const { height } = ELEMENT.BUY_SIZE;
    const { buyOffset } = ELEMENT.LAYOUT;
    const buyPos = { x: root.x + buyOffset.x, y: root.y + buyOffset.y };
    this.writeText(ELEMENT.BUY, buyPos, `${(cost / 100).toFixed(2)}`);

    // Draw Buy Box
    const plusPos = { x: buyPos.x + 5, y: buyPos.y - height * 0.8 };
    this.drawBuyBox(plusPos, key, cost);

    if (map === true) this.mapBuyBox(plusPos, ELEMENT.BUY_SIZE, key);
  }

  /**
   * Draws the buy button box.
   * @param root Anchor position of the job box.
   * @param key Business key.
   * @param cost Cost to write.
   */
  private drawBuyBox(root: Vector2, key: Business, cost: number): void {
    const { down, up, forbidden } = ELEMENT.BUY_COLORS;
    let color = forbidden;
    if (cost < this.dataManager.playerData.money) color = this.lastClick === key ? down : up;

    this.context.fillStyle = color;
    this.context.fillRect(root.x, root.y, ELEMENT.BUY_SIZE.width, ELEMENT.BUY_SIZE.height);
    this.writeText(ELEMENT.PLUS, { x: root.x + 10, y: root.y + 15 });
  }
  // #endregion

  // #region Auto
  /**
   * Draws the auto button label and box for a given business.
   * @param root Vector2, position to draw it in.
   * @param key Business key for the given button.
   * @param cost Price to draw.
   * @param stats Player Job Stats.
   * @param map Whether or not to map the button to a click area.
   */
  private drawAuto(root: Vector2, key: Business, cost: number, stats: JobStats, map: boolean): void {
    // Draw AUTO Box
    const { height } = ELEMENT.AUTO_SIZE;
    const { autoOffset } = ELEMENT.LAYOUT;
    const autoPos = { x: root.x + autoOffset.x, y: root.y + autoOffset.y };
    const bgPos = { x: autoPos.x - 60, y: autoPos.y - height * 0.8 };
    this.drawAutoBox(bgPos, key, stats, cost);

    // Draw AUTO Label
    this.writeText(ELEMENT.AUTO, autoPos, `${(cost / 100).toFixed()}`);

    if (map === true) this.mapAutoBox(bgPos, ELEMENT.AUTO_SIZE, key);
  }

  /**
   * Draws the auto button box.
   * @param root Anchor position of the job box.
   * @param key Business key.
   * @param stats Player Job Stats.
   * @param cost Cost to write.
   */
  drawAutoBox(root: Vector2, key: Business, stats: JobStats, cost: number): void {
    const { down, up, forbidden } = ELEMENT.AUTO_COLORS;
    let color = forbidden;
    if (stats !== undefined && stats.managed === true) color = down;
    else if (cost < this.dataManager.playerData.money) color = up;

    this.context.fillStyle = color;
    this.context.fillRect(root.x, root.y, ELEMENT.AUTO_SIZE.width, ELEMENT.AUTO_SIZE.height);
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

  /**
   * Maps a box to a datamanager buy click.
   * @param boxAt Point where box starts.
   * @param size Size of the box.
   * @param key Business key to map.
   */
  private mapAutoBox(boxAt: Vector2, size: Size, key: Business): void {
    const callback = () => this.dataManager.treatClick(key, ButtonType.Auto);

    const box: BoundingBox = [boxAt, { x: boxAt.x + size.width, y: boxAt.y + size.height }];
    const button: Button = { box, callback };
    this.mouseTracker.addListener(button);
  }
  // #endregion
}
