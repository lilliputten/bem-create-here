/* eslint-env es6, node, mocha */
/* --eslint-disable no-console, no-debugger */
'use strict';

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
// const mkdirp = require('mkdirp');
// const naming = require('@bem/naming');
// const EOL = require('os').EOL;
// const stream = require('stream');
const assert = require('assert');

// Testing class
const CreateHere = require('..');

// Environment paths
const runDir = __dirname;
const initialCwd = process.cwd();

// Modifier's prefix, delim
const modPrefix = '_';
const modDelim = '_';

// Entities...
const levelName = 'test';
const blockName = 'tmpBlock';
const elemName = 'tmpElem';
const modName = 'tmpMod';

// Entity paths...
const levelPath = runDir; // path.join(runDir, levelName);
const blockPath = path.join(levelPath, blockName);
const blockModPath = path.join(blockPath, modPrefix + modName);
const elemPath = path.join(blockPath, elemName);
const elemModPath = path.join(elemPath, modPrefix + modName);

// Reusable CreateHere instance variable
let createHere;

describe('bem-create-here', () => {

  /*{{{*/describe('should parse entities', () => {

    /*{{{*/describe('level', () => {
      beforeEach(() => {
        createHere = new CreateHere({ cwdPath: levelPath });
      });
      it('createHere should contain `level` prioperty', () => {
        assert.equal(createHere.level, levelName);
      });
    });/*}}}*/

    /*{{{*/describe('block', () => {
      beforeEach(() => {
        createHere = new CreateHere({ cwdPath: blockPath });
      });
      it('createHere should contain `block` prioperty', () => {
        assert.equal(createHere.block, blockName);
      });
    });/*}}}*/

    /*{{{*/describe('elem', () => {
      beforeEach(() => {
        createHere = new CreateHere({ cwdPath: elemPath });
      });
      it('createHere should contain `elem` prioperty', () => {
        assert.equal(createHere.elem, elemName);
      });
    });/*}}}*/

    /*{{{*/describe('block modifier', () => {
      beforeEach(() => {
        createHere = new CreateHere({ cwdPath: blockModPath });
      });
      it('createHere should contain `mod` prioperty', () => {
        assert.equal(createHere.mod, modName);
      });
    });/*}}}*/

    /*{{{*/describe('elem modifier', () => {
      beforeEach(() => {
        createHere = new CreateHere({ cwdPath: elemModPath });
      });
      it('createHere should contain `mod` prioperty', () => {
        assert.equal(createHere.mod, modName);
      });
    });/*}}}*/

  });/*}}}*/

  /*{{{*/describe('call bem-tools-create', () => {

    describe('should create block', () => {
      beforeEach(() => {
        process.argv.push('-f', '-m', modName, '-T', 'css');
        createHere = new CreateHere({ /* DEBUG: true, */ cwdPath: blockPath });
      });
      afterEach(() => {
        rimraf.sync(blockPath);
        process.chdir(initialCwd);
      });
      it('folder must be created', (done) => {
        createHere.runBemTools();
        // Using timeout for ensure `bem create` command done.
        // TODO: Is it safe method?
        setTimeout(() => {
          // Expecting css mod file
          const modFileName = blockName + modDelim + modName + '.css';
          const modFilePath = path.join(blockModPath, modFileName);
          if (fs.existsSync(modFilePath)) {
            done();
          }
          else {
            throw new Error(`Expected mod file (${modFilePath}) was not created`);
          }
        }, 1000);
      });
    });

  });/*}}}*/

});
