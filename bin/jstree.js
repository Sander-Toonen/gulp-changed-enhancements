#!/usr/bin/env node

const getFiles = require('../').getFiles

const argv = require('yargs').argv
const file = argv._[0]
const regex = /import.+(?:["'])(.*?)(?:["'])/gm
const extensions = ['.js', '.jsx']
const files = getFiles(file, {regex, extensions})

console.log(files)
