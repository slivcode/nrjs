#!/usr/bin/env node

import { execSync } from 'child_process';
import { matchHarness } from 'ramda-match';
import { NRJS } from './nrjs-class';
import minimist = require('minimist');

const { argv } = process;

export async function CLI () {
  const { fix, _ } = minimist(argv.slice(2));
  await NRJS.init();
  await NRJS.fixNPMScripts();
  matchHarness(m => {
    m(s => s.fix, () => null);
    m(s => s._.length > 0, (s) => execSync(`npm run ${s._[0]}`, { stdio: 'inherit', cwd: NRJS.pathRoot }));
    m(s => true, () => NRJS.startPicker());
  })(minimist(argv.slice(2)));
}