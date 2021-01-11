import { Size } from '../types/physics';
import { ButtonLayout, LabelElement, LineElement } from '../types/elements';

export const TITLE: LabelElement = {
  fontSize: 30,
  fillStyle: 'white',
  content: 'TS Trucker',
  align: 'left',
};

export const LINE: LineElement = {
  fillStyle: 'white',
  start: { x: 20, y: 60 },
  end: { x: 700, y: 60 },
};

export const MONEY: LabelElement = {
  fontSize: 30,
  fillStyle: 'white',
  content: 'T$',
  align: 'right',
};

export const NAME: LabelElement = { fontSize: 18, content: '', align: 'right' };

export const PROFIT: LabelElement = { fontSize: 16, content: `Profit: T$`, align: 'right' };

export const BUTTON: Size = { height: 80, width: 280 };

export const LAYOUT: ButtonLayout = {
  anchor: { x: 30, y: 90 },
  span: { x: 100, y: 30 },
  srcOffset: { x: 15, y: 20 },
  nameOffset: { x: 268, y: 25 },
  profitOffset: { x: 268, y: 46 },
};
