export function difference<A>(setA: Set<A>, setB: Set<A>): Set<A> {
  // eslint-disable-next-line no-underscore-dangle
  const _difference = new Set<A>(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export function arraySetsEqual<A>(setA: Set<A>, setB: Set<A>): boolean {
  const diff1 = difference(setA, setB);
  const diff2 = difference(setB, setA);
  return (diff1.size === 0 && diff2.size === 0);
}

export const JSONClone = (obj: any) => JSON.parse(JSON.stringify(obj));
