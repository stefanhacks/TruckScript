import { Business } from '../models/jobs';
import sheet from '../../gfx/pixelcarpack_kenney/Spritesheet/carpack.png';
import { Vector2, Size } from '../types/physics';

export type ImageAsset = { url: string; data?: CanvasImageSource };

export const CarSheet: ImageAsset = { url: sheet };

export const BGSheet: ImageAsset = { url: sheet };

export const EmoteSheet: ImageAsset = { url: sheet };

export type SheetCoords = { anchor: Vector2; size: Size };

const HOT_DOG: SheetCoords = {
  anchor: { x: 246, y: 402 },
  size: { width: 105, height: 55 },
};

export const JOB_SHEET_COORDS: Record<Business, SheetCoords> = {
  [Business.HotDog]: HOT_DOG,
  [Business.Newspaper]: HOT_DOG,
  [Business.Packages]: HOT_DOG,
  [Business.InterState]: HOT_DOG,
  [Business.Explosives]: HOT_DOG,
  [Business.Chemicals]: HOT_DOG,
  [Business.Military]: HOT_DOG,
};
