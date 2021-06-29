// eslint-disable-next-line import/no-extraneous-dependencies
import '@relmify/jest-fp-ts';

import { either } from 'fp-ts';
import { COMMAND_FACTORY, isBezierCommand } from '../src';
import { CODES, CommandArray, eqCommand } from '../src/types/command';
import { arraySetsEqual, JSONClone } from './util';
import { isSymmetricBezierCommand, safelyPushCommand } from '../src/lib/command';

const SAMPLE_COMMANDS = [
  COMMAND_FACTORY.M([0, 1]),
  COMMAND_FACTORY.L([2, 2]),
  COMMAND_FACTORY.Q([2, 2], [8, 8]),
  COMMAND_FACTORY.S([2, 2], [8, 8]),
  COMMAND_FACTORY.C([2, 2], [8, 8], [4, 4]),
  COMMAND_FACTORY.T([9, 0]),
  COMMAND_FACTORY.A(10, 20, 0, false, false, [7, 7]),
  COMMAND_FACTORY.Z(),
];

describe('command operations', () => {
  it('sample test cases cover all commands, with command codes unique across sample set', () => {
    const sampleCodes = SAMPLE_COMMANDS.map(({ code }) => code);
    const sampleCodesSet = new Set(sampleCodes);
    expect(sampleCodesSet.size).toEqual(sampleCodes.length);
    expect(arraySetsEqual(sampleCodesSet, new Set(Object.keys(COMMAND_FACTORY))));
  });

  describe('eqCommand', () => {
    it('returns true when passed 2 references to the same object', () => {
      for (const command of SAMPLE_COMMANDS) {
        expect(eqCommand.equals(command, command)).toEqual(true);
      }
    });

    it('returns true when passed and object and a clone of that object', () => {
      for (const command of SAMPLE_COMMANDS) {
        expect(eqCommand.equals(command, command)).toEqual(true);
      }
    });

    it('no 2 commands with different command codes are ever equal and each comparison is transitive', () => {
      const NUM_COMMANDS = SAMPLE_COMMANDS.length;

      for (let i = 0; i < NUM_COMMANDS; i += 1) {
        for (let j = 0; j < NUM_COMMANDS; j += 1) {
          // eslint-disable-next-line no-continue
          if (i === j) { continue; }
          expect(eqCommand.equals(SAMPLE_COMMANDS[i], SAMPLE_COMMANDS[j])).toEqual(false);
        }
      }
    });

    const sampleTypeBasedModifier = {
      string: (str: string) => `${str}******`,
      number: (num: number) => num + 1,
      boolean: (bool: boolean) => !bool,
      // how to safely infer object type corresponds to Point2D?
      object: (coord: Array<number>) => {
        if (!coord.length || coord.length !== 2) {
          throw new Error(`expected command key of type "object" to be a length 2 tuple but found: ${coord}`);
        }
        return coord.map((num) => num + 1);
      },
    };

    it('a cloned command will become unequal to its source if any property it has is modified', () => {
      for (const command of SAMPLE_COMMANDS) {
        for (const key of Object.keys(command)) {
          // we already tested commands with different codes
          if (key === 'code') { continue; }
          const clonedCommand = JSONClone(command);
          // @ts-ignore
          clonedCommand[key] = sampleTypeBasedModifier[typeof command[key]](clonedCommand[key]);
          expect(eqCommand.equals(clonedCommand, command)).toEqual(false);
        }
      }
    });
  });

  describe('safelyPushCommand', () => {
    it('returns left if a non-move command is initially applied', () => {
      const nonMoveCommands = SAMPLE_COMMANDS.filter(({ code }) => code !== CODES.M);
      for (const com of nonMoveCommands) {
        expect(safelyPushCommand(com)(either.right([]))).toEqualLeft(
          `safelyPushCommand: first command must be "M" but saw "${com.code}"`,
        );
      }
    });

    it('returns left if a symmetric bezier curve follows a non-bezier command', () => {
      const bezierCommands = SAMPLE_COMMANDS.filter(isBezierCommand);
      const symmetricBezierCommands = SAMPLE_COMMANDS.filter(isSymmetricBezierCommand);
      const startedPath = safelyPushCommand(COMMAND_FACTORY.M([0, 0]))(either.right([]));

      for (const previousCommand of bezierCommands) {
        for (const candidateItem of symmetricBezierCommands) {
          const withPrevious = safelyPushCommand(previousCommand)(startedPath);
          expect(withPrevious).toBeRight();
          expect(safelyPushCommand(candidateItem)).toBeLeft();
        }
      }
    });

    it('returns a left if a move command follows another move command', () => {
      const startedPath = safelyPushCommand(COMMAND_FACTORY.M([0, 0]))(either.right([] as CommandArray));
      expect(startedPath).toBeRight();
      expect(safelyPushCommand(COMMAND_FACTORY.M([1, 2]))(startedPath)).toBeLeft();
    });
  });
});
