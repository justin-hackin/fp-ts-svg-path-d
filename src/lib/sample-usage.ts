import { function as fpFunction, either } from 'fp-ts';
import {
  COMMAND_FACTORY, pathDToCommandArray, commandArrayToPathD, pushCommands,
} from './command';
import { prettyPrintIdentityWithPrefix } from './util';

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
