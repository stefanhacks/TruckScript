import { BoundingBox, Vector2 } from './physics';

export type Button = { box: BoundingBox; callback: () => void };

export type LabelElement = {
  content: string;
  fontSize?: number;
  fontFamily?: string;
  fillStyle?: string;
  align?: CanvasTextAlign;
};

export type LineElement = {
  fillStyle: string;
  start: Vector2;
  end: Vector2;
};

export type ButtonLayout = {
  anchor: Vector2;
  span: Vector2;
  srcOffset: Vector2;
  nameOffset: Vector2;
  profitOffset: Vector2;
  buyOffset: Vector2;
  autoOffset: Vector2;
};

export enum ButtonType {
  Run,
  Buy,
  Auto,
}

export type ButtonColors = {
  down: string;
  up: string;
  forbidden: string;
};
