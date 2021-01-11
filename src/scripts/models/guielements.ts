import { Vector2 } from '../types/physics';
import { TextElement, LineElement, JobBoxElement } from '../types/elements';

export const TITLE_SPECS: TextElement = {
  font: '30px system-ui',
  fillStyle: 'white',
  content: 'TS Trucker',
  align: 'left',
  position: { x: 20, y: 40 } as Vector2,
};

export const TITLE_LINE_SPECS: LineElement = {
  fillStyle: 'white',
  start: { x: 20, y: 60 },
  end: { x: 700, y: 60 },
};

export const BUTTON_SPECS: LineElement = {
  fillStyle: 'white',
  start: { x: 20, y: 60 },
  end: { x: 700, y: 60 },
};

export const MAIL_SPECS: JobBoxElement = {
  box: [
    { x: 0, y: 0 },
    { x: 500, y: 60 },
  ],
  sprite: {
    anchor: { x: 246, y: 402 },
    size: { width: 105, height: 55 },
  },
};
