#!/usr/bin/env node

const getFiles = require('../').getFiles

const argv = require('yargs').argv
const file = argv._[0]
const regex = /@import\s+(["'])(.*?)(["'])/gm
const regexElement = 2
const extensions = ['.css', '.sss']

const files = getFiles(file, {regex, regexElement, extensions})

console.log(files)
