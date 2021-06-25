import { Vec } from 'fp-ts-sized-vectors';

export type Point2D = Vec<2, number>;

export interface PointLike {
  x: number,
  y: number,
  [x: string]: any
}

export type PointTuple = [number, number];
export type Coord = PointTuple | PointLike;
