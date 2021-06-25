export type Point2D = [number, number];

export interface PointLike {
  x: number,
  y: number,
  [x: string]: any
}

export type Coord = Point2D | PointLike;
