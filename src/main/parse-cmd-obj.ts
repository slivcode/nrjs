import { match, matchHarness } from 'ramda-match';
import { is } from '../util/is';
import { NSJS } from './interface';
import Command = NSJS.Command;
import CommandSet = NSJS.CommandSet;
import NRJSModule = NSJS.NRJSModule;



// @internal
export function FnCmdStr (path: (string | number) []) {
  const arrMap = path.map(p => `[${p}]`).join('');
  const script = `require('./nr')${arrMap}()`;
  return `node -e \"${script}\"`;
}

// @internal
export function normalizeAndSinglelineCmdStr (s: string): string {
//  return s;
  return s.split('\n').map(s => s.trim()).filter(v => v.length !== 0).join(' ');
}