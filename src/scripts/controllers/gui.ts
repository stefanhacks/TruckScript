import { VIEW_SIZE } from '../../game';
import MouseTracker from './mousetracker';
import DataManager from './datamanager';

import { Business, Job } from '../models/jobs';
import { PlayerData } from '../models/playerdata';
import { TITLE, LINE, MONEY, BUTTON, LAYOUT, NAME, PROFIT } from '../models/guielements';

import { LineElement } from '../types/elements';
import writeText from '../utils/write';
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
  }

  /**
   * Cycle to draw all Gui Elements.
   * @param data PlayerData object, so player data may be fetched and drawn.
   */
  public drawGUI(data: PlayerData): void {
    this.clearContext();

    this.drawLine(LINE);
    this.drawButtons(data);

    writeText(this.context, TITLE, { x: 20, y: 40 });
    writeText(this.context, MONEY, { x: 700, y: 40 }, (data.money / 100).toFixed(2));
  }

  /**
   * Clears context.
   */
  private clearContext(): void {
    const { width, height } = VIEW_SIZE;
    this.context.clearRect(0, 0, width, height);
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

  private drawButton(player: PlayerData, key: Business): void {
    const { anchor: layoutAnchor, span } = LAYOUT;

    const offset = BUTTON.width + span.x;
    const oddOffset = Math.floor(key % 2) === 0 ? 0 : offset;
    const lastOffset = key === this.dataManager.availableJobs.size - 1 ? offset / 2 : 0;

    const x = layoutAnchor.x + oddOffset + lastOffset;
    const y = layoutAnchor.y + (BUTTON.height + span.y) * Math.floor(key / 2);
    const position = { x, y };

    this.drawBorder(position, lastOffset);
    this.drawTruck(position, key);
    this.drawInfo(position, key, player, lastOffset);
  }

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

  private drawBorder(position: Vector2, lastOffset: number): void {
    this.context.beginPath();
    this.context.rect(position.x - lastOffset / 2, position.y, BUTTON.width + lastOffset, BUTTON.height);
    this.context.stroke();
  }

  private drawInfo(position: Vector2, key: Business, player: PlayerData, lastOffset: number): void {
    const { nameOffset, profitOffset } = LAYOUT;
    const jobInfo = this.dataManager.availableJobs.get(key);

    const namePos = { x: position.x + nameOffset.x + lastOffset / 2, y: position.y + nameOffset.y };
    writeText(this.context, NAME, namePos, jobInfo.name);

    const profitPosition = { x: position.x + profitOffset.x + lastOffset / 2, y: position.y + profitOffset.y };
    const amount = player.jobStats[key] !== undefined ? player.jobStats[key].amount : 0;
    const profit = `${jobInfo.profit} × ${amount}`;
    writeText(this.context, PROFIT, profitPosition, profit);
  }

  // #endregion
}
