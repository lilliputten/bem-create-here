/* eslint-env es6, node, commonjs */
/* --eslint-disable no-debugger, no-console */
'use strict';

const path = require('path');
const bemConfig = require('@bem/sdk.config');
const fs = require('fs');
// const BemEntityName = require('@bem/entity-name');
// const BemCell = require('@bem/cell');
// const scheme = require('@bem/fs-scheme');
// const bemNaming = require('@bem/naming');

// const DEBUG = true;

class CreateHere {

  /*
   * (Pseudo) public varibales (should we use TS?):
   *   - block
   *   - mod
   *   - elem
   */

  /** constructor ** {{{
   */
  constructor({ DEBUG, cwdPath } = {}) {

    // Debug mode?
    this.DEBUG = DEBUG || this.isDebugOptionPassed();

    // Lookup for bemrc files with names...
    this.bemrcNames = [
      '.bemrc',
      '.bemrc.js',
    ];

    cwdPath = path.resolve(cwdPath || process.cwd() || '');

    // Bem config
    const cfg = this.getBemConfig(cwdPath);

    // Constants (TODO: Fetch from cfg?)...
    this.modDirPrefix = '_';
    this.modDirDelim = '_';

    // Project path
    this.prjPath = this.getPrjRootPath(cfg, cwdPath); // TODO: Is it safe method to derermine project root?
    if (!this.prjPath) {
      throw new Error(`Cannot find project root (finding bemrc) for path '${cwdPath}'`);
    }

    // Get all `levelPaths` from config
    const levelPaths = this.getLevelPaths(cfg);

    // Find level path in `levelPaths` for current working dir (cwd)
    const currLevelPath = this.getCurrLevelPath(cwdPath, levelPaths);

    if (!currLevelPath) {
      // throw new Error(`Cannot determine level for path '${cwdPath}'`);
    }
    else {

      // Set found level
      this.level = currLevelPath && this.relPath(currLevelPath);
      this.DEBUG && this.level && console.log('Found level:', this.level); // eslint-disable-line no-console

      // Rest path for fetching extra options...
      const restPath = path.relative(currLevelPath, cwdPath).replace(/\\/g, '/');
      const rest = restPath.split('/');

      // Fetch block, elem, mod...
      this.fetchRestBlock(rest);

    }

  }/*}}}*/

  /** getPrjRootPath ** {{{
   * @param {Object} cfg
   * @param {String} cwdPath
   * @return {String|undefined}
   */
  getPrjRootPath(cfg, cwdPath) {
    // Easy method -- from config (is it safe?)
    if (cfg.__source) {
      return path.dirname(cfg.__source);
    }
    // Try to find parent folder contains any bemrc file...
    let dir = cwdPath;
    while (dir) {
      // Has bemrc?
      for (let i = 0; i < this.bemrcNames.length; i++) {
        const fn = path.join(dir, this.bemrcNames[i]);
        if (fs.existsSync(fn)) {
          return dir;
        }
      }
      // Next uplevel dir?
      const dirNext = path.dirname(dir);
      if (dirNext === dir) {
        break;
      }
      dir = dirNext;
    }
  }/*}}}*/

  /** relPath ** {{{ Get relative path to project root
   * @param {String} to
   * @param {String} [from=this.prjRoot]
   * @return {String}
   */
  relPath(to, from) {
    from = from || this.prjPath || '';
    return path.relative(from, to);
  }/*}}}*/

  /** isDebugOptionPassed ** {{{ Is debug key (`-d`) passed in command line?
   * @return {Boolean|undefined}
   */
  isDebugOptionPassed() {
    const p = process.argv.indexOf('-d');
    if (p !== -1) {
      // Remove option...
      process.argv.splice(p, 1);
      return true;
    }
  }/*}}}*/

  /** fetchRestBlock ** {{{
   * @param {String[]} rest
   * @return {Boolean|undefined}
   * Side effect: set `this.block`, `this.mod` or `this.elem`
   */
  fetchRestBlock(rest) {
    if (rest.length) {
      this.block = rest.shift();
      if (this.block) {
        this.DEBUG && console.log('Found block:', this.block); // eslint-disable-line no-console
        return this.fetchRestModOrElem(rest);
      }
    }
  }/*}}}*/
  /** fetchRestModOrElem ** {{{
   * @param {String[]} rest
   * @return {Boolean|undefined}
   * Side effect: set `this.mod` or `this.elem`
   */
  fetchRestModOrElem(rest) {
    if (rest.length) {
      const elem = rest.shift();
      // Is it modifier?
      if (this.parseMod(elem)) {
        return true;
      }
      // Else it is elem...
      else {
        this.elem = elem;
        this.DEBUG && console.log('Found elem:', this.elem); // eslint-disable-line no-console
        // Elem modifier?
        if (rest.length) {
          const elemMod = rest.shift();
          this.parseMod(elemMod);
        }
        return true;
      }
    }
  }/*}}}*/
  /** parseMod ** {{{ Parse mod from dirname
   * @param {String} modDirName
   * @return {Boolean|undefined}
   * Side effect: set `this.mod`
   */
  parseMod(modDirName) {
    if (modDirName.indexOf(this.modDirPrefix) === 0) {
      this.mod = modDirName.substr(this.modDirPrefix.length);
      this.DEBUG && console.log('Found mod:', this.mod); // eslint-disable-line no-console
      return true;
    }
  }/*}}}*/
  /** getCurrLevelPath ** {{{
   * @param {String} cwdPath
   * @param {String[]} levelPaths
   * return {String|undefined}
   */
  getCurrLevelPath(cwdPath, levelPaths) {
    for ( let i in levelPaths ) {
      const dir = levelPaths[i];
      if (cwdPath.indexOf(dir) === 0) {
        return dir;
      }
    }
  }/*}}}*/

  /** getBemConfig ** {{{
   * @return {Object}
   */
  getBemConfig(cwdPath) {
    // Get levelPaths from config
    const baseConfig = bemConfig({ cwd: cwdPath });
    return baseConfig.getSync();
  }/*}}}*/

  /** getLevelPaths ** {{{
   * @param {Object} cfg
   * @return {String[]}
   */
  getLevelPaths(cfg) {
    // Levels
    const levels = cfg.levels;
    // All level paths
    const levelPaths = levels.map((level) => path.resolve(level.path));
    return levelPaths;
  }/*}}}*/

  /** changeRootDir ** {{{ Change current dir to project root
   */
  changeRootDir() {
    process.chdir(this.prjPath);
  }/*}}}*/

  /** addArgvOptions ** {{{ Add command line keys for `bem create`
   */
  addArgvOptions() {

    // Add `create` command
    process.argv.splice(2, 0, 'create');

    // Add bem path options...
    this.addArgvOption('-l', this.level);
    this.addArgvOption('-b', this.block);
    this.addArgvOption('-e', this.elem);
    this.addArgvOption('-m', this.mod);

  }/*}}}*/

  /** addArgvOption ** {{{ Add key to command line (process.argv)
   */
  addArgvOption(opt, value) {
    if (value) {
      // If duplicated option then throw error...
      if (process.argv.indexOf(opt) !== -1) {
        throw new Error(`Duplicated key '${opt}'`);
      }
      // Else add values to command line...
      else {
        process.argv.push(opt, value);
      }
    }
  }/*}}}*/

  /** runBemTools ** {{{ External interface for calling `bem-tools-core` with updated options
   */
  runBemTools() {

    // Change current dir to project root
    this.changeRootDir();

    // Add command line keys for `bem create`
    this.addArgvOptions();

    // Run `bem tools create ...`
    require('bem-tools-core');

  }/*}}}*/

}

module.exports = CreateHere;
