export interface RawPoint {
  x: number,
  y: number,
}

export interface PointLike extends RawPoint {
  [x: string]: any
}

export type PointTuple = [number, number];
export type Coord = PointTuple | PointLike;
