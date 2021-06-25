export const prettyPrintIdentityWithPrefix = (prefix: string) => (obj: any) => {
  console.log(prefix, JSON.stringify(obj, null, 2));
  return obj;
};
