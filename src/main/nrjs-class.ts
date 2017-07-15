#!/usr/bin/env node;

import { execSync } from 'child_process';
import fromPromise from 'err-result-pair/lib/main/fromPromise';
import fromTryCatch from 'err-result-pair/lib/main/fromTryCatch';
import * as inquirer from 'inquirer';
import { tmpdir } from 'os';
import { dirname, resolve } from 'path';
import { matchHarness } from 'ramda-match';
import { readFileAsync, writeFileAsync } from '../util/fs-promised';
import { is } from '../util/is';
import { toPairs } from '../util/to-pairs';
import { NSJS } from './interface';
import { FnCmdStr, normalizeAndSinglelineCmdStr } from './parse-cmd-obj';
import readPkgUp = require('read-pkg-up');
import Command = NSJS.Command;
import NRJSModule = NSJS.NRJSModule;

const { assign, keys } = Object;
const { stringify, parse } = JSON;

export class NRJSClass {
  nrJsModule: NRJSModule;
  pathPkgJson: string;
  pathRoot: string;
  pkgJson: any;
  recentJson: Record<string, string>;
  pathRecentJson: string = resolve(tmpdir(), 'nrjs-recent.json');

  async init () {
    const [readPkgErr, { path, pkg }] = await fromPromise(() => readPkgUp());
    if (readPkgErr) {
      throw readPkgErr;
    }
    this.pkgJson = pkg;
    this.pathPkgJson = path;
    delete pkg['_id'];
    this.pathRoot = dirname(this.pathPkgJson);
    const nrJsPath = resolve(this.pathRoot, 'nr.js');
    const [nsJsErr, _nrJsModule] = fromTryCatch(() => require(nrJsPath));
    if (nsJsErr) {
      throw nsJsErr;
    }
    this.nrJsModule = _nrJsModule;
  }

  async getRecent () {
    const [err, content] = await fromPromise<string>(
      () => readFileAsync(this.pathRecentJson, 'utf-8') as Promise<string>,
    );
    const [jsonErr, recentJson] = fromTryCatch(() => parse(content || '{}'));
    this.recentJson = recentJson;
    return this.recentJson[this.pathRoot];
  }

  async setRecent (task) {
    const nextRecent = assign({}, this.recentJson, { [this.pathRoot]: task });
    await writeFileAsync(this.pathRecentJson, stringify(nextRecent));
  }

  async startPicker () {
    const recentItem = await this.getRecent();
    const { target } = await inquirer.prompt({
      type: 'list',
      name: 'target',
      choices: Object.keys(NRJS.pkgJson.scripts || {}),
      'default': recentItem,
      message: 'pick a script to run',
    });
    if (target) {
      await NRJS.runTask(target);
      await this.setRecent(target);
    }
  }

  async runTask (taskName: string) {
    const { nrJsModule, pathPkgJson, pathRoot } = this;
    execSync(`npm run ${taskName}`, { stdio: 'inherit', cwd: pathRoot });
  }

  async fixNPMScripts () {
    const { pkgJson, pathPkgJson, nrJsModule } = this;
    const scripts = toPairs(nrJsModule)
      .reduce((o, [k, v]) => {
        o[k] = v.map((s, i) => NRJSClass.parseCmdObject(s, [`'${k}'`, i])).join('\n');
        return o;
      }, {});
    if (stringify(scripts) !== stringify(pkgJson['scripts'])) {
      const nextPkgJson = assign({}, pkgJson, { scripts });
      const content = stringify(nextPkgJson, null, 2);
      await writeFileAsync(pathPkgJson, content);
      this.pkgJson = nextPkgJson;
    }
  }

  static parseCmdObject (cmd: Command, path: (string | number)[]) {
    const m = matchHarness<string>(m => {
      m(is.func, () => FnCmdStr(path));
      m(is.atStr, (s: string) => {
        const i = s.indexOf(' ');
        const j = i === -1 ? undefined : i;
        const task = s.slice(1, j);
        const restArgs = j ? ' ' + s.slice(j + 1) : '';
        return `npm run ${task}${restArgs}`;
      });
      m(is.str, normalizeAndSinglelineCmdStr);
      m(is.hasProp('script'), (s: { script }) => s.script);
    });
    return m(cmd);
  }
}


export const NRJS = new NRJSClass();