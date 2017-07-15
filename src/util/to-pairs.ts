const { keys } = Object;

// @internal
export function toPairs (o: Object) {
  return keys(o).map(k => [k, o[k]]);
}