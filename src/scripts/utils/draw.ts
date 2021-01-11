import { LineElement, TextElement } from '../types/elements';

/**
 * Given context and a text element type, draws text.
 * @param context Canvas to draw with.
 * @param text Typed element with text configuration.
 */
export function drawText(context: CanvasRenderingContext2D, text: TextElement): void {
  const { content, font, fillStyle, position, align } = text;

  context.font = font !== undefined ? font : '20px system-ui';
  context.textAlign = align !== undefined ? align : 'left';
  context.fillStyle = fillStyle !== undefined ? fillStyle : 'white';

  context.fillText(content, position.x, position.y);
}

/**
 * Given context and a line element type, draws a line.
 * @param context Canvas to draw with.
 * @param text Typed element with line configuration.
 */
export function drawLine(context: CanvasRenderingContext2D, line: LineElement): void {
  const { fillStyle, start, end } = line;

  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = fillStyle;
  context.stroke();
}
