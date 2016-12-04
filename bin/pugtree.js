#!/usr/bin/env node

var getFiles = require('../').getFiles

const argv = require('yargs').argv
const file = argv._[0]
const regex = /(include|extends?)\s(.*)/gm
const regexElement = 2
const extensions = ['', '.pug', '.jade']

const files = getFiles(file, regex, regexElement, extensions)

console.log(files)
