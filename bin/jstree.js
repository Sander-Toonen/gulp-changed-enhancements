#!/usr/bin/env node

var getJSFiles = require('../').getJSFiles

const argv = require('yargs').argv

const files = getJSFiles(argv._[0])

// files.forEach((file) => {
console.log(files)
// })
