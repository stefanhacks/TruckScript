import { BoundingBox, Size, Vector2 } from './physics';

export type Button = { box: BoundingBox; callback: () => void };

export type TextElement = {
  content: string;
  position: Vector2;
  font?: string;
  fillStyle?: string;
  align?: CanvasTextAlign;
};

export type LineElement = {
  fillStyle: string;
  start: Vector2;
  end: Vector2;
};

export type JobBoxElement = {
  box: BoundingBox;
  sprite: { anchor: Vector2; size: Size };
};
