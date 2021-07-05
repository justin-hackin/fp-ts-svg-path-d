import { eq } from 'fp-ts';
import {
  Coord, PointLike, Point2D, PointTuple,
} from '../types/geom';

// exported for testing only
export const MARGIN_OF_ERROR = 0.0000001;

const eqNumberRoughly: eq.Eq<number> = { equals: (x, y) => Math.abs(x - y) < MARGIN_OF_ERROR };

export const eqPoint: eq.Eq<Point2D> = eq.struct({
  x: eqNumberRoughly,
  y: eqNumberRoughly,
});

// self-comparison excludes NaN as NaN !== NaN
// eslint-disable-next-line no-self-compare
const isFiniteNumber = (val: any) => val === val && Math.abs(val) !== Infinity;

const isNumber = (val: any) => typeof val === 'number';
const isPointLike = (coord: Coord): coord is PointLike => isNumber((coord as PointLike).x)
  && isNumber((coord as PointLike).y);

// note JSON.stringify([NaN]) === "[null]", using "accurate" replacer from util.ts adds quotes: ["NaN"]
export const stringifyCoord = (coord: Coord) => (isPointLike(coord)
  ? `{x:${coord.x}, y:${coord.y}}` : `[${coord.join(',')}]`);

const assertPointValuesValid = (coord: Coord) => {
  const coordIsPointLike = isPointLike(coord);
  const x = coordIsPointLike ? (coord as PointLike).x : (coord as PointTuple)[0];
  const y = coordIsPointLike ? (coord as PointLike).y : (coord as PointTuple)[1];
  const xIsValid = isFiniteNumber(x);
  const yIsValid = isFiniteNumber(y);
  if (!xIsValid || !yIsValid) {
    throw new Error(
      `castCoordToPoint2D failed to cast parameter ${stringifyCoord(coord)
      }: both coordinate values must not be NaN or +/-Infinity`,
    );
  }
};

export const point2D = (x: number, y: number): Point2D => {
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) {
    throw new Error(`point2D failed with parameters ${x}, ${y
    }: both parameters must not be NaN or +/-Infinity`);
  }
  return { x, y };
};

export const castCoordToPoint2D = (coord: Coord): Point2D => {
  assertPointValuesValid(coord);
  if (isPointLike(coord)) {
    const { x, y } = coord as PointLike;
    return { x, y };
  }
  return { x: coord[0], y: coord[1] };
};

export const rawPointToString = ({ x, y }: Point2D) => `${x},${y}`;

export const TWO_PI = Math.PI * 2;
export const polarPoint = (radius: number) => (circleFraction: number) :Point2D => {
  const trigParam = circleFraction * TWO_PI - TWO_PI / 4;
  return {
    x: Math.cos(trigParam) * radius, y: Math.sin(trigParam) * radius,
  };
};
