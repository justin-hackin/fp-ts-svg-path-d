import { eq, array } from 'fp-ts';
import {
  Coord, PointLike, Point2D,
} from '../types/geom';

export const point = (x: number, y: number): Point2D => [x, y];

const eqNumber: eq.Eq<number> = { equals: (x, y) => x === y };

export const eqPoint: eq.Eq<Point2D> = array.getEq(eqNumber);

// self-comparison excludes NaN as NaN !== NaN
// eslint-disable-next-line no-self-compare
const isFiniteNumber = (val: any) => val === val && Math.abs(val) !== Infinity;

const isNumber = (val: any) => typeof val === 'number';
const isPointLike = (coord: Coord): coord is PointLike => isNumber((coord as PointLike).x)
  && isNumber((coord as PointLike).y);


// note JSON.stringify([NaN]) === "[null]", using "accurate" replacer from util.ts adds quotes to e.g. ["NaN"]
export const stringifyCoord = (coord: Coord) => (isPointLike(coord)
  ? `{x:${coord.x}, y:${coord.y}}` : `[${coord.join(',')}]`);

const assertPointValuesValid = (coord: Coord) => {
  const coordIsPointLike = isPointLike(coord);
  const x = coordIsPointLike ? (coord as PointLike).x : coord[0];
  const y = coordIsPointLike ? (coord as PointLike).y : coord[1];
  const xIsValid = isFiniteNumber(x);
  const yIsValid = isFiniteNumber(y);
  if (!xIsValid || !yIsValid) {
    throw new Error(
      `castCoordToPoint2D failed to cast parameter ${stringifyCoord(coord)
      }: both coordinate values must not be NaN or +/-Infinity`,
    );
  }
};

export const castCoordToPoint2D = (coord: Coord): Point2D => {
  assertPointValuesValid(coord);
  if (isPointLike(coord)) {
    const { x, y } = coord as PointLike;
    return [x, y];
  }
  return [...coord];
};

export const rawPointToString = ([x, y]: Point2D) => `${x},${y}`;
