export const prettyPrintIdentityWithPrefix = (prefix: string) => (obj: any) => {
  // eslint-disable-next-line no-console
  console.log(prefix, JSON.stringify(obj, null, 2));
  return obj;
};
