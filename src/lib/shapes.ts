import { Point2D } from '../types/geom';
import {
  COMMAND_FACTORY, commandConcat,
} from './command';
import { CommandArray } from '../types/command';

export const lineSegmentSeries = (points: Point2D[], addClose = false): CommandArray => (
  commandConcat(addClose ? [COMMAND_FACTORY.Z()] : [])(
    points.map((point, index) => (index ? COMMAND_FACTORY.L(point) : COMMAND_FACTORY.M(point))),
  )
);

export const arcCircle = (radius: number, textFlowIsOutside = true) => ([
  COMMAND_FACTORY.M([-radius, 0]),
  COMMAND_FACTORY.A(radius, radius, 0, textFlowIsOutside, true, [radius, 0]),
  COMMAND_FACTORY.A(radius, radius, 0, textFlowIsOutside, true, [-radius, 0]),
]);

// from https://spencermortensen.com/articles/bezier-circle/
const CTRL_RATIO = 0.551915024494;
export const bezierOval = (radiusX: number, radiusY: number) => ([
  COMMAND_FACTORY.M([0, radiusY]),
  COMMAND_FACTORY.C([CTRL_RATIO * radiusX, radiusY], [radiusX, CTRL_RATIO * radiusY], [radiusX, 0]),
  COMMAND_FACTORY.C([radiusX, -radiusY * CTRL_RATIO], [radiusX * CTRL_RATIO, -radiusY], [0, -radiusY]),
  COMMAND_FACTORY.C([-radiusX * CTRL_RATIO, -radiusY], [-radiusX, -radiusY * CTRL_RATIO], [-radiusX, 0]),
  COMMAND_FACTORY.C([-radiusX, radiusY * CTRL_RATIO], [-radiusX * CTRL_RATIO, radiusY], [0, radiusY]),
]);

export const bezierCircle = (radius: number) => bezierOval(radius, radius);
