import { Size } from '../types/physics';
import { ButtonColors, ButtonLayout, LabelElement, LineElement } from '../types/elements';

export const LOADING: LabelElement = {
  content: 'loading...',
  fontSize: 20,
  fontFamily: 'system-ui',
  align: 'center',
  fillStyle: 'white',
};

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

export const NAME: LabelElement = {
  fontSize: 18,
  content: '',
  align: 'right',
};

export const PROFIT: LabelElement = {
  fontSize: 16,
  content: 'Profit: T$',
  align: 'right',
};

export const BUY: LabelElement = {
  fontSize: 16,
  content: 'BUY: T$',
  align: 'right',
};

export const AUTO: LabelElement = {
  fontSize: 16,
  content: 'AUTO: T$',
  align: 'center',
};

export const PLUS: LabelElement = {
  fontSize: 16,
  content: '+',
  fillStyle: 'white',
  align: 'center',
};

export const BUTTON_SIZE: Size = {
  height: 80,
  width: 280,
};

export const BUY_SIZE: Size = {
  height: 20,
  width: 20,
};

export const AUTO_SIZE: Size = {
  height: 20,
  width: 120,
};

export const BUY_COLORS: ButtonColors = {
  up: 'green',
  down: '#B4F8C8',
  forbidden: 'gray',
};

export const AUTO_COLORS: ButtonColors = {
  up: 'green',
  down: '#364652',
  forbidden: 'gray',
};

export const LAYOUT: ButtonLayout = {
  anchor: { x: 30, y: 90 },
  span: { x: 100, y: 50 },
  srcOffset: { x: 15, y: 20 },
  nameOffset: { x: 268, y: 25 },
  profitOffset: { x: 268, y: 46 },
  buyOffset: { x: 125, y: 105 },
  autoOffset: { x: 220, y: 105 },
};
