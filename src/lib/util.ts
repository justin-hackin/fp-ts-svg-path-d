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

