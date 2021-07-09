import { eq } from 'fp-ts';
import { Point2D } from './geom';

export enum CODES { M = 'M', L = 'L', C = 'C', Q = 'Q', A = 'A', Z = 'Z' }

export interface BaseCommand {
  code: CODES,
}

export interface DestinationCommand extends BaseCommand {
  to: Point2D
}

export interface MoveCommand extends DestinationCommand {
  code: CODES.M
}

export interface LineCommand extends DestinationCommand {
  code: CODES.L
}

export interface CubicBezierCommand extends DestinationCommand {
  code: CODES.C
  ctrl1: Point2D
  ctrl2: Point2D
}

export interface QuadraticBezierCommand extends DestinationCommand {
  code: CODES.Q
  ctrl1: Point2D
}

export interface ArcCommand extends DestinationCommand {
  code: CODES.A
  rx: number
  ry: number
  sweepFlag: boolean
  largeArcFlag: boolean
  xAxisRotation: number
}

export interface CloseCommand extends BaseCommand {
  code: CODES.Z
}

export type Command =
  MoveCommand
  | LineCommand
  | CubicBezierCommand
  | QuadraticBezierCommand
  | ArcCommand
  | CloseCommand;
export type BezierCommand = QuadraticBezierCommand | CubicBezierCommand;
export type OnlyToParamCommand = LineCommand | MoveCommand;
export type CommandArray = Array<Command>;

export const eqCommand: eq.Eq<Command> = {
  equals: (a, b) => {
    if (a === b) { return true; }
    if (a.code !== b.code) { return false; }
    // TODO: is there a better way to do this without equality for each command type
    return JSON.stringify(a) === JSON.stringify(b);
  },
};
