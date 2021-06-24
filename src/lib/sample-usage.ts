import {function as fpFunction, either} from 'fp-ts';
import {
  COMMAND_FACTORY,
  pathDToCommandArray,
  prettyPrintIdentityWithPrefix,
  pushMap,
  serializeCommandsArray
} from '../index';

const sampleCommandsString = fpFunction.pipe([],
  pushMap(COMMAND_FACTORY.M([1, 1])),
  pushMap(COMMAND_FACTORY.L([20, 20])),
  pushMap(COMMAND_FACTORY.L([0, 20])),
  serializeCommandsArray,
  prettyPrintIdentityWithPrefix('>>>'),
);

fpFunction.pipe(pathDToCommandArray(sampleCommandsString), either.map(
  fpFunction.flow(
    pushMap(COMMAND_FACTORY.Q([20, 20], [20, 40])),
    pushMap(COMMAND_FACTORY.S([0, 20], [0, 0])),
    serializeCommandsArray,
    prettyPrintIdentityWithPrefix('$$$')
  )),
);
