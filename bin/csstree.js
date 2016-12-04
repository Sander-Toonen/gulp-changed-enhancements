#!/usr/bin/env node

var getCSSFiles = require('../').getCSSFiles

const argv = require('yargs').argv

const files = getCSSFiles(argv._[0])

files.forEach((file) => {
  console.log(file)
})
