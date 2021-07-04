function accurateNumberReplacer(_: any, value: any) {
  if (value === Infinity) {
    return 'Infinity';
  } if (value === -Infinity) {
    return '-Infinity';
    // eslint-disable-next-line no-self-compare
  } if (value !== value) {
    return 'NaN';
  }
  return value;
}

export const prettyPrintIdentityWithPrefix = (prefix: string) => (obj: any) => {
  // eslint-disable-next-line no-console
  console.log(prefix, JSON.stringify(obj, accurateNumberReplacer, 2));
  return obj;
};
type ViewBoxArray = [number, number, number, number];
export const renderPathToSvg = (viewBox: ViewBoxArray, pathD: string, pathAttributes: object) => (
  `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   viewBox="${viewBox.join(' ')}"
   version="1.1"
   inkscape:version="1.0.1 (3bc2e813f5, 2020-09-07)">
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <path d="${pathD}" ${Object.entries(pathAttributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />
  </g>
</svg>
`);
export const centeredViewBox = (radius: number): ViewBoxArray => [-radius, -radius, 2 * radius, 2 * radius];
