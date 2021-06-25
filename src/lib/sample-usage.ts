import {function as fpFunction, either} from 'fp-ts';
import {COMMAND_FACTORY, pathDToCommandArray, pushCommand, commandArrayToPathD} from './command';
import {prettyPrintIdentityWithPrefix} from './util';

const sampleCommandsString = fpFunction.pipe([],
  pushCommand(COMMAND_FACTORY.M([1, 1])),
  pushCommand(COMMAND_FACTORY.L([20, 20])),
  pushCommand(COMMAND_FACTORY.L([0, 20])),
  prettyPrintIdentityWithPrefix('1) >>> command array >>>'),
  commandArrayToPathD,
  prettyPrintIdentityWithPrefix('1) >>> path data string >>>'),
);

fpFunction.pipe(pathDToCommandArray(sampleCommandsString), either.map(
  fpFunction.flow(
    pushCommand(COMMAND_FACTORY.Q([20, 20], [20, 40])),
    pushCommand(COMMAND_FACTORY.S([0, 20], [0, 0])),
    prettyPrintIdentityWithPrefix('2) >>> command array >>>'),
    commandArrayToPathD,
    prettyPrintIdentityWithPrefix('2) >>> path data string >>>'),
  )),
);

