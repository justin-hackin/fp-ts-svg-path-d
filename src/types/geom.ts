export interface Point2D {
  x: number,
  y: number,
}
export type PointTuple = [number, number];
export interface PointLike extends Point2D {
  [x: string]: any,
}

export type Coord = Point2D | PointLike | PointTuple;
