import { Point2D } from '../types/geom';
import { COMMAND_FACTORY, commandConcat } from './command';
import { CommandArray } from '../types/command';

export const lineSegmentSeries = (points: Point2D[], addClose = false): CommandArray => (
  commandConcat(addClose ? [COMMAND_FACTORY.Z()] : [])(
    points.map((point, index) => (index ? COMMAND_FACTORY.L(point) : COMMAND_FACTORY.M(point))),
  )
);
