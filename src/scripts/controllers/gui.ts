import { VIEW_SIZE } from '../../game';
import MouseTracker from './mousetracker';
import DataManager from './datamanager';

import { Business, Job } from '../models/jobs';
import { PlayerData } from '../models/playerdata';
import { TITLE, LINE, MONEY, BUTTON_SIZE, LAYOUT, NAME, PROFIT, LOADING } from '../models/guielements';

import { LabelElement, LineElement } from '../types/elements';
import { JOB_SHEET_COORDS, CarSheet } from '../utils/imagebundler';
import { Vector2 } from '../types/physics';

export default class GUI {
  // #region Vars
  private context: CanvasRenderingContext2D;

  private mouseTracker: MouseTracker;

  private dataManager: DataManager;
  // #endregion

  // #region Constructor
  public constructor(context: CanvasRenderingContext2D, mouseTracker: MouseTracker, dataManager: DataManager) {
    this.context = context;
    this.mouseTracker = mouseTracker;
    this.dataManager = dataManager;

    this.writeText(this.context, LOADING, { x: VIEW_SIZE.width / 2, y: VIEW_SIZE.height / 2 });
  }

  /**
   * Cycle to draw all Gui Elements.
   * @param data PlayerData object, so player data may be fetched and drawn.
   */
  public drawGUI(data: PlayerData): void {
    this.clearContext();

    this.drawLine(LINE);
    this.drawButtons(data);

    this.writeText(this.context, TITLE, { x: 20, y: 40 });
    this.writeText(this.context, MONEY, { x: 700, y: 40 }, (data.money / 100).toFixed(2));
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
   */
  private drawButtons(player: PlayerData): void {
    this.dataManager.availableJobs.forEach((job: Job<Business>, key: Business) => {
      if (key in Business === true) this.drawButton(player, +key as Business);
    });
  }

  /**
   * Draws a single button for a given player/key combo.
   * @param player PlayerData object.
   * @param key Business key object, to which to draw with.
   */
  private drawButton(player: PlayerData, key: Business): void {
    const { anchor: layoutAnchor, span } = LAYOUT;

    const offset = BUTTON_SIZE.width + span.x;
    const oddOffset = Math.floor(key % 2) === 0 ? 0 : offset;
    const lastOffset = key === this.dataManager.availableJobs.size - 1 ? offset / 2 : 0;

    const x = layoutAnchor.x + oddOffset + lastOffset;
    const y = layoutAnchor.y + (BUTTON_SIZE.height + span.y) * Math.floor(key / 2);
    const position = { x, y };

    this.drawBorder(position, lastOffset);
    this.drawTruck(position, key);
    this.drawInfo(position, key, player, lastOffset);
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
   * @param position Vector2, position to draw it in.
   * @param offset Adds to button's horizontal position.
   */
  private drawBorder(position: Vector2, offset: number): void {
    this.context.beginPath();
    this.context.rect(position.x - offset / 2, position.y, BUTTON_SIZE.width + offset, BUTTON_SIZE.height);
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
  // #endregion
}
