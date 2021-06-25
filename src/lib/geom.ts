import { eq, array } from 'fp-ts';
import {
  Coord, PointLike, Point2D,
} from '../types/geom';

export const point = (x: number, y: number): Point2D => [x, y];

const eqNumber: eq.Eq<number> = { equals: (x, y) => x === y };

export const eqPoint: eq.Eq<Point2D> = array.getEq(eqNumber);


// self-comparison excludes NaN as NaN !== NaN
// eslint-disable-next-line no-self-compare
const isNumber = (val: any) => typeof val === 'number' && val === val;

const isPointLike = (coord: Coord): coord is PointLike => isNumber((coord as PointLike).x)
  && isNumber((coord as PointLike).y);

export const castCoordToRawPoint = (coord: Coord): Point2D => {
  if (isPointLike(coord)) {
    const { x, y } = coord as PointLike;
    return [x, y];
  }
  if ((coord as Point2D).length !== 2) {
    throw new Error(`expected a PointLike object or an array of length 2 but instead saw ${coord}`);
  }
  return [...coord];
};

export const rawPointToString = ([x, y]: Point2D) => `${x},${y}`;
