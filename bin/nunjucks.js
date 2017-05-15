#!/usr/bin/env node

const getFiles = require('../').getFiles

const argv = require('yargs').argv
const file = argv._[0]
const regex = /{%\s+extends\s+(?:["'])(.*?)(?:["'])\s+%}/gm
const extensions = ['.njk']

const files = getFiles(file, {regex, extensions})

console.log(files)
