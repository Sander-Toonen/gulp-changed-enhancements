#!/usr/bin/env node

var getPugFiles = require('../').getPugFiles

const argv = require('yargs').argv

const files = getPugFiles(argv._[0])

console.log(files)
