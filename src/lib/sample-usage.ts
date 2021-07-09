import { function as fpFunction, either, function as fpFunc } from 'fp-ts';
import fs from 'fs';

import {
  COMMAND_FACTORY, pathDToCommandArray, commandArrayToPathD, pushCommands,
} from './command';
import { centeredViewBox, prettyPrintIdentityWithPrefix, renderPathToSvg } from './util';
import { bezierOval } from './shapes';

const sampleCommandsString = fpFunction.pipe([],
  pushCommands([
    COMMAND_FACTORY.M([1, 1]),
    COMMAND_FACTORY.L([20, 20]),
    COMMAND_FACTORY.L([0, 20]),
  ]),
  prettyPrintIdentityWithPrefix('1) >>> command array >>>'),
  commandArrayToPathD,
  prettyPrintIdentityWithPrefix('1) >>> path data string >>>'));

fpFunction.pipe(pathDToCommandArray(sampleCommandsString), either.map(
  fpFunction.flow(
    pushCommands([
      COMMAND_FACTORY.Q([20, 20], [20, 40]),
      COMMAND_FACTORY.S([0, 20], [0, 0]),
    ]),
    prettyPrintIdentityWithPrefix('2) >>> command array >>>'),
    commandArrayToPathD,
    prettyPrintIdentityWithPrefix('2) >>> path data string >>>'),
  ),
));

const STAR_RADIUS = 1000;
fpFunc.pipe(
  bezierOval(STAR_RADIUS, STAR_RADIUS / 2),
  commandArrayToPathD,
  (pathD: string) => renderPathToSvg(
    centeredViewBox(STAR_RADIUS), pathD, { stroke: 'black', 'stroke-width': '5px', fill: 'none' },
  ),
  (svg: string) => {
    fs.writeFileSync('bezier-oval.svg', svg);
  },
);
