import { castCoordToPoint2D, point2D } from '../src/lib/geom';

describe('geom', () => {
  describe('castCoordToPoint2D', () => {
    it('returns a length 2 tuple when passed an object with x and y properties', () => {
      expect(castCoordToPoint2D({ x: 0, y: 0 })).toEqual([0, 0]);
      expect(castCoordToPoint2D({ x: 100, y: 200 })).toEqual([100, 200]);
      expect(castCoordToPoint2D({ x: 100, y: 200, z: 1500 })).toEqual([100, 200]);
    });

    it('returns a cloned copy of length 2 array (not the original instance it was passed)', () => {
      const point:[number, number] = [88, 99];
      const castPoint = castCoordToPoint2D(point);
      expect(Boolean(point === castPoint)).toEqual(false);
    });

    it('throws error if one or more coordinates is NaN or +/-Infinity', () => {
      const coordinates = [0, NaN, -Infinity, Infinity];
      for (const x of coordinates) {
        for (const y of coordinates) {
          if (x === 0 && y === 0) { continue; }
          expect(() => { castCoordToPoint2D([x, y]); })
            .toThrow(`castCoordToPoint2D failed to cast parameter [${x},${y
            }]: both coordinate values must not be NaN or +/-Infinity`);
          expect(() => { castCoordToPoint2D({ x, y }); })
            .toThrow(`castCoordToPoint2D failed to cast parameter {x:${x}, y:${y
            }}: both coordinate values must not be NaN or +/-Infinity`);
        }
      }
    });
  });

  describe('point2D', () => {
    it('throws error if one or more parameters is NaN or +/-Infinity', () => {
      const coordinates = [0, NaN, -Infinity, Infinity];
      for (const x of coordinates) {
        for (const y of coordinates) {
          if (x === 0 && y === 0) { continue; }
          expect(() => { point2D(x, y); })
            .toThrow(`point2D failed with parameters ${x}, ${y
            }: both parameters must not be NaN or +/-Infinity`);
        }
      }
    });

    it('constructs a length 2 tuple with valid values for x and y', () => {
      const x = 4;
      const y = 8;
      const pt = point2D(x, y);
      expect(pt).toHaveLength(2);
      expect(pt[0]).toEqual(x);
      expect(pt[1]).toEqual(y);
    });
  });
});
