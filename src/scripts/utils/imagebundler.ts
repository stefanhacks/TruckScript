import sheet from '../../gfx/pixelcarpack_kenney/Spritesheet/carpack.png';

export type Bundle = { url: string; data?: CanvasImageSource };

export type AssetBundle = Map<string, Bundle>;

export const SpriteSheet: Bundle = { url: sheet };
