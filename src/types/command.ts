import {RawPoint} from './geom';

export enum CODES { M = 'M', L = 'L', C = 'C', S = 'S', Q = 'Q', T = 'T', A = 'A', Z = 'Z' }

export interface BaseCommand {
  code: CODES,
}

export interface DestinationCommand extends BaseCommand {
  to: RawPoint
}

export interface MoveCommand extends DestinationCommand {
  code: CODES.M
}

export interface LineCommand extends DestinationCommand {
  code: CODES.L
}

export interface CubicBezierCommand extends DestinationCommand {
  code: CODES.C
  ctrl1: RawPoint
  ctrl2: RawPoint
}

export interface SymmetricCubicBezierCommand extends DestinationCommand {
  code: CODES.S
  ctrl2: RawPoint
}

export interface QuadraticBezierCommand extends DestinationCommand {
  code: CODES.Q
  ctrl1: RawPoint
}

export interface SymmetricQuadraticBezierCommand extends DestinationCommand {
  code: CODES.T
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
  | SymmetricCubicBezierCommand
  | QuadraticBezierCommand
  | SymmetricQuadraticBezierCommand
  | ArcCommand
  | CloseCommand;
export type BezierCommand = QuadraticBezierCommand | SymmetricQuadraticBezierCommand |
  CubicBezierCommand | SymmetricCubicBezierCommand;
export type OnlyToParamCommand = LineCommand | MoveCommand | SymmetricQuadraticBezierCommand;
export type CommandArray = Array<Command>;

