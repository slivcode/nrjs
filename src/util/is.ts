const isType = (t) => (s) => typeof s === t;
const isObj = isType('object');
const isStr = isType('string');
const isFunc = isType('function');
const isHasProp = (k) => (s) => isObj(s) && s[k] !== undefined;

//@internal
export const is = {
  type: isType,
  hasProp: isHasProp,
  arr: Array.isArray,
  func: isFunc,
  str: isStr,
  obj: isObj,
  atStr: (s) => isStr(s) && <string>s.startsWith('@'),
};