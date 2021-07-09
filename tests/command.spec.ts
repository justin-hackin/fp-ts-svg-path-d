import { COMMAND_FACTORY } from '../src';
import { eqCommand } from '../src/types/command';
import { arraySetsEqual, JSONClone } from './util';
import { Point2D } from '../src/types/geom';

describe('command operations', () => {
  describe('eqCommand', () => {
    const SAMPLE_COMMANDS = [
      COMMAND_FACTORY.M([0, 1]),
      COMMAND_FACTORY.L([2, 2]),
      COMMAND_FACTORY.Q([2, 2], [8, 8]),
      COMMAND_FACTORY.C([2, 2], [8, 8], [4, 4]),
      COMMAND_FACTORY.A(10, 20, 0, false, false, [7, 7]),
      COMMAND_FACTORY.Z(),
    ];

    it('sample test cases cover all commands, with command codes unique across sample set', () => {
      const sampleCodes = SAMPLE_COMMANDS.map(({ code }) => code);
      const sampleCodesSet = new Set(sampleCodes);
      expect(sampleCodesSet.size).toEqual(sampleCodes.length);
      expect(arraySetsEqual(sampleCodesSet, new Set(Object.keys(COMMAND_FACTORY))));
    });

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
      object: ({ x, y }: Point2D) => ({ x: x + 1, y: y - 1 }),
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
});
