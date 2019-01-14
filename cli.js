#!/usr/bin/env node
/* eslint-env es6, node */
'use strict';

const CreateHere = require('./create-here');

const createHere = new CreateHere();

createHere.runBemTools();
