import { either, function as fpFunction, array as fpArray } from 'fp-ts';
import svgpath from 'svgpath';
import {
  ArcCommand,
  BezierCommand,
  CloseCommand,
  CODES,
  Command,
  CommandArray,
  CubicBezierCommand,
  DestinationCommand,
  LineCommand,
  MoveCommand,
  OnlyToParamCommand,
  QuadraticBezierCommand,
  SymmetricCubicBezierCommand,
  SymmetricQuadraticBezierCommand
} from './types/command';
import {Coord, PointLike, PointTuple, RawPoint} from './types/geom';

const BEZIER_COMMAND_CODES = [CODES.Q, CODES.T, CODES.C, CODES.S];
const hasOnlyToParam = (command: Command): command is OnlyToParamCommand =>
  [CODES.L, CODES.M, CODES.T]
    .includes((command as OnlyToParamCommand).code);

const isBezierCommand = (command: Command): command is BezierCommand =>
  BEZIER_COMMAND_CODES.includes((command as BezierCommand).code);

const isNumber = (val: any) => typeof val === "number" && val === val;
const isPointLike = (coord: Coord): coord is PointLike => isNumber((coord as PointLike).x)
  && isNumber((coord as PointLike).y);

export const castCoordToRawPoint = (coord: Coord): RawPoint => {
  if (isPointLike(coord)) {
    const { x, y } = coord as PointLike;
    return { x, y };
  }
  if ((coord as PointTuple).length !== 2) {
    throw new Error(`expected a PointLike object or an array of length 2 but instead saw ${coord}`);
  }
  const [x, y] = coord as PointTuple;
  return { x, y };
};

export const rawPointToString = ({ x, y }: RawPoint) => `${x},${y}`;

// TODO: how to make this custom type guard, return type "command is DestinationCommand" does not work
// TODO: remove casting in getDestinationPoints
const isDestinationCommand = (command: Command): boolean => !!((command as DestinationCommand).to);

const commandToString = (command: Command) => {
  if (command.code === CODES.Z) { return command.code; }
  if (hasOnlyToParam(command)) {
    return `${command.code} ${rawPointToString(command.to)}`;
  }
  if (command.code === CODES.Q) {
    return `${command.code} ${rawPointToString(command.ctrl1)} ${rawPointToString(command.to)}`;
  }
  if (command.code === CODES.C) {
    return `${command.code} ${rawPointToString(command.ctrl1)} ${rawPointToString(command.ctrl2)} ${
      rawPointToString(command.to)}`;
  }
  if (command.code === CODES.S) {
    return `${command.code} ${rawPointToString(command.ctrl2)} ${rawPointToString(command.to)}`;
  }
  if (command.code === CODES.A) {
    const arcCommand = command as ArcCommand;
    const booleanToFlag = (flag:boolean):number => (flag ? 1 : 0);
    return `${arcCommand.code} ${arcCommand.rx} ${arcCommand.ry} ${arcCommand.xAxisRotation} ${
      booleanToFlag(arcCommand.sweepFlag)} ${booleanToFlag(arcCommand.largeArcFlag)} ${rawPointToString(arcCommand.to)}`;
  }
  // if this runs then all commands have not been covered above
  throw new Error('Unrecognized command code');
};

// if type is "Record<CODES, (...rest: any)=>Command>" the function signature type gets clobbered
export const COMMAND_FACTORY = {
  M: (to:Coord):MoveCommand => ({
    code: CODES.M,
    to: castCoordToRawPoint(to),
  }),
  L: (to:Coord):LineCommand => ({
    code: CODES.L,
    to: castCoordToRawPoint(to),
  }),
  C: (ctrl1:Coord, ctrl2:Coord, to:Coord):CubicBezierCommand => ({
    code: CODES.C,
    to: castCoordToRawPoint(to),
    ctrl1: castCoordToRawPoint(ctrl1),
    ctrl2: castCoordToRawPoint(ctrl2),
  }),
  S: (ctrl2:Coord, to:Coord):SymmetricCubicBezierCommand => ({
    code: CODES.S,
    to: castCoordToRawPoint(to),
    ctrl2: castCoordToRawPoint(ctrl2),
  }),
  Q: (ctrl1:Coord, to:Coord): QuadraticBezierCommand => ({
    code: CODES.Q,
    to: castCoordToRawPoint(to),
    ctrl1: castCoordToRawPoint(ctrl1),
  }),
  T: (to:Coord):SymmetricQuadraticBezierCommand => ({
    code: CODES.T,
    to: castCoordToRawPoint(to),
  }),
  A: (
    radiusX: number, radiusY: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean, to:Coord,
  ):ArcCommand => ({
    code: CODES.A,
    rx: radiusX,
    ry: radiusY,
    largeArcFlag,
    sweepFlag,
    xAxisRotation,
    to: castCoordToRawPoint(to),
  }),
  Z: ():CloseCommand => ({
    code: CODES.Z,
  }),
};

type ISvgPath = typeof svgpath;

function deserializePathD(d: string): either.Either<Array<String>, ISvgPath> {
    let parsed: ISvgPath = svgpath(d);
    // TODO: PR for svgpath to add err to interface
    // @ts-ignore
    if (parsed.err) { return either.left(parsed.err as Array<String>); }

    parsed = parsed.abs();
    return either.right(parsed);
};

// converts the data structure returned from svgpath into array of Command objects
function svgPathToCommandArray(svgPath: ISvgPath):CommandArray {
  const commandList: CommandArray = [];
  // we can't simply map each command in isolation
  // because V/H commands need to be aware of last command endpoint
  svgPath.iterate(([code, ...params], index, x, y) => {
    if (code === 'Z') {
      commandList.push(COMMAND_FACTORY.Z());
    }
    if (['L', 'M', 'T'].includes(code)) {
      // @ts-ignore
      commandList.push(COMMAND_FACTORY[code]([...params]));
    } else if (code === 'V' || code === 'H') {
      // V and H commands are irregular in that
      // they don't have a .to parameter and thus complicate iteration modifications
      // for convenience and consistency, convert to a L command
      commandList.push(COMMAND_FACTORY.L(code === 'V' ? [x, params[0]] : [params[0], y]));
    } else if (code === 'C') {
      commandList.push(COMMAND_FACTORY.C(
        [params[0], params[1]],
        [params[2], params[3]],
        [params[4], params[5]],
      ));
    } else if (code === 'Q' || code === 'S') {
      // TODO: make DRY while preserving typing
      // can't splat [params[0], params[1]], [params[2], params[3]] inside command factory functions
      commandList.push( code === 'Q' ?
        COMMAND_FACTORY.Q([params[0], params[1]], [params[2], params[3]])
        : COMMAND_FACTORY.S([params[0], params[1]], [params[2], params[3]]) );
    } else if (code === 'A') {
      commandList.push(COMMAND_FACTORY.A(
        params[0], params[1], params[2], !!params[3], !!params[4], [params[5], params[6]],
      ));
    }
  });
  return commandList;
}

export const prettyPrintIdentityWithPrefix = (prefix: string) => (obj: any) => {
  console.log(prefix, JSON.stringify(obj, null, 2));
  return obj;
};

export const pathDToCommandArray = fpFunction.flow(deserializePathD, either.map(svgPathToCommandArray));

const joinStrings = (sep: string) => (s: string[]) => s.join(sep);

export const serializeCommandsArray = fpFunction.flow(fpArray.map(commandToString), joinStrings(' '));

export const reformatPathD = fpFunction.flow(pathDToCommandArray, either.map(serializeCommandsArray));

export const pushMap = (command: Command) => (commands: CommandArray) => {
  commands.push(command);
  return commands;
};
