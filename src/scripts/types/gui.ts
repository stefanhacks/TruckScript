import { BoundingBox } from './physics';

export type Button = { box: BoundingBox; callback: () => void };
