import { vec } from 'fp-ts-sized-vectors';
import {Coord, PointLike, PointTuple, Point2D} from '../types/geom';

const isNumber = (val: any) => typeof val === "number" && val === val;

const isPointLike = (coord: Coord): coord is PointLike => isNumber((coord as PointLike).x)
  && isNumber((coord as PointLike).y);

export const castCoordToRawPoint = (coord: Coord): Point2D => {
  if (isPointLike(coord)) {
    const {x, y} = coord as PointLike;
    return vec(x, y);
  }
  if ((coord as PointTuple).length !== 2) {
    throw new Error(`expected a PointLike object or an array of length 2 but instead saw ${coord}`);
  }
  return vec(...coord);
};

export const rawPointToString = ([x, y]: Point2D) => `${x},${y}`; // converts the data structure returned from svgpath into array of Command objects
