#!/usr/bin/env node

const getFiles = require('../').getFiles

const argv = require('yargs').argv
const file = argv._[0]
const regex = /(include|extends|extend)\s(.*)/gm
const regexElement = 2
const extensions = ['.pug', '.jade']

const files = getFiles(file, {regex, regexElement, extensions})

console.log(files)
