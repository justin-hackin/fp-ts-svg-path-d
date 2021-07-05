import {
  castCoordToPoint2D, eqPoint, MARGIN_OF_ERROR, point2D,
} from '../src/lib/geom';
import { Point2D } from '../src/types/geom';

describe('geom', () => {
  describe('castCoordToPoint2D', () => {
    it('returns a length 2 tuple when passed an object with x and y properties', () => {
      expect(castCoordToPoint2D({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
      expect(castCoordToPoint2D({ x: 100, y: 200 })).toEqual({ x: 100, y: 200 });
      expect(castCoordToPoint2D({ x: 100, y: 200, z: 1500 })).toEqual({ x: 100, y: 200 });
    });

    it('when passed length 2 tuple returns an object with '
      + 'x as first element of array and y as second element of array', () => {
      const point:[number, number] = [88, 99];
      const castPoint = castCoordToPoint2D(point);
      expect(castPoint.x).toEqual(point[0]);
      expect(castPoint.y).toEqual(point[1]);
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

  describe('point2D constructor', () => {
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

    it('constructs an object where x is first parameter and y is second parameter', () => {
      const x = 4;
      const y = 8;
      const pt = point2D(x, y);
      expect(pt.x).toEqual(x);
      expect(pt.y).toEqual(y);
    });
  });

  describe('Point2D loose equality', () => {
    const samplePoints: Point2D[] = [point2D(0, 0), point2D(0, 1), point2D(2, 0), point2D(Math.PI, Math.PI),
      point2D(13332424.43234, 3354345.34534),
    ];
    it('returns true when passed a point and a copy of a point', () => {
      for (const samplePoint of samplePoints) {
        const { x, y } = samplePoint;
        expect(eqPoint.equals(samplePoint, { x, y })).toEqual(true);
      }
    });

    const ACCEPTABLE_MARGIN = MARGIN_OF_ERROR * 0.9;
    const UNACCEPTABLE_MARGIN = MARGIN_OF_ERROR * 1.1;

    const testMarginOfError = (samplePoint: Point2D, margin: number, expected: boolean) => {
      const { x, y } = samplePoint;
      expect(eqPoint.equals(samplePoint, { x: x + margin, y })).toEqual(expected);
      expect(eqPoint.equals(samplePoint, { x: x + margin, y: y + margin })).toEqual(expected);
      expect(eqPoint.equals(samplePoint, { x, y: y + margin })).toEqual(expected);
      expect(eqPoint.equals(samplePoint, { x: x - margin, y })).toEqual(expected);
      expect(eqPoint.equals(samplePoint, { x: x - margin, y: y - margin })).toEqual(expected);
      expect(eqPoint.equals(samplePoint, { x, y: y - margin })).toEqual(expected);
    };

    it('returns true when there is an acceptable difference between coordinates', () => {
      for (const samplePoint of samplePoints) {
        testMarginOfError(samplePoint, ACCEPTABLE_MARGIN, true);
      }
    });

    it('returns false when there is an unacceptable difference between coordinates', () => {
      for (const samplePoint of samplePoints) {
        testMarginOfError(samplePoint, UNACCEPTABLE_MARGIN, false);
      }
    });
  });
});
