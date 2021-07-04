import { array, function as fpFunc } from 'fp-ts';
import fs from 'fs';

import { lineSegmentSeries } from '../src/lib/shapes';
import { polarPoint } from '../src/lib/geom';
import {
  commandArrayToPathD, pushCommands, centeredViewBox, renderPathToSvg,
} from '../src';

// see https://en.wikipedia.org/wiki/Star_polygon
export const starPolygon = (p: number, q: number, r: number) => {
  const polarPointWithRadius = polarPoint(r);
  const starPoints = array.range(0, p).map((index) => polarPointWithRadius(((index * q) % p) / p));
  return lineSegmentSeries(starPoints, true);
};

const STAR_RADIUS = 640;
fpFunc.pipe(
  [],
  pushCommands(starPolygon(9, 2, STAR_RADIUS)),
  commandArrayToPathD,
  (pathD: string) => renderPathToSvg(
    centeredViewBox(STAR_RADIUS), pathD, { stroke: 'black', 'stroke-width': '5px', fill: 'none' },
  ),
  (svg: string) => {
    fs.writeFileSync('star-polygon.svg', svg);
  },
);
