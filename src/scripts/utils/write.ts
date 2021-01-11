import { Vector2 } from '../types/physics';
import { LabelElement } from '../types/elements';

/**
 * Given context and a text element type, draws text.
 * @param context Context to draw with.
 * @param text Typed element with text configuration.
 * @param position Where to write at.
 * @param append Optional string. Appends to end of content.
 */
function writeText(
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

export default writeText;
