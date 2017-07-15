import { readFile, writeFile } from 'fs';
// @internal
export function promisifyNode (f) {
  return (...args) => new Promise((r, d) => f(...args, (e, t) => e ? d(e) : r(t)));
}
// @internal
export const writeFileAsync = promisifyNode(writeFile);
// @internal
export const readFileAsync = promisifyNode(readFile);