import { Business } from '../models/jobs';
import sheet from '../../gfx/pixelcarpack_kenney/Spritesheet/carpack.png';
import { Vector2, Size } from '../types/physics';

export type ImageAsset = { url: string; data?: CanvasImageSource };

export const CarSheet: ImageAsset = { url: sheet };

export type SheetCoords = { anchor: Vector2; size: Size };

const HOT_DOG: SheetCoords = {
  anchor: { x: 141, y: 248 },
  size: { width: 120, height: 55 },
};

const NEWSPAPER: SheetCoords = {
  anchor: { x: 195, y: 10 },
  size: { width: 114, height: 55 },
};

const PACKAGES: SheetCoords = {
  anchor: { x: 255, y: 310 },
  size: { width: 110, height: 55 },
};

const INTERSTATE: SheetCoords = {
  anchor: { x: 246, y: 402 },
  size: { width: 105, height: 55 },
};

const EXPLOSIVES: SheetCoords = {
  anchor: { x: 140, y: 402 },
  size: { width: 105, height: 55 },
};

const CHEMICALS: SheetCoords = {
  anchor: { x: 177, y: 80 },
  size: { width: 114, height: 55 },
};

const MILITARY: SheetCoords = {
  anchor: { x: 0, y: 88 },
  size: { width: 176, height: 55 },
};

export const JOB_SHEET_COORDS: Record<Business, SheetCoords> = {
  [Business.HotDog]: HOT_DOG,
  [Business.Newspaper]: NEWSPAPER,
  [Business.Packages]: PACKAGES,
  [Business.InterState]: INTERSTATE,
  [Business.Explosives]: EXPLOSIVES,
  [Business.Chemicals]: CHEMICALS,
  [Business.Military]: MILITARY,
};
