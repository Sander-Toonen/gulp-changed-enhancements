#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')
const fileExists = require('file-exists')

const fileExistWithExtension = (file, extensions) => {
  let fileWithExt = null
  extensions.forEach((extension) => {
    if (fileExists(`${file}${extension}`)) {
      fileWithExt = `${file}${extension}`
      return
    }
  })
  return fileWithExt
}

const fsOperationFailed = (stream, sourceFile, err) => {
  if (err) {
    if (err.code !== 'ENOENT') {
      stream.emit('error', new gutil.PluginError('gulp-changed', err, {
        fileName: sourceFile.path
      }))
    }
    stream.push(sourceFile)
  }
  return err
}

const getFiles = function getFiles (file, regex, regexElement, extensions) {
  let files = []
  const fileDirname = path.dirname(file)
  const data = fs.readFileSync(file, 'utf8')
  let result = regex.exec(data)
  while (result) {
    files.push(result[regexElement])
    result = regex.exec(data)
  }
  files = files.map((file) => {
    file = path.join(fileDirname, file)
    try {
      if (fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index')
      }
    } catch (err) {}
    return fileExistWithExtension(file, extensions)
  })
  files = files.filter((file) => file)
  const bfiles = files.slice()
  bfiles.forEach((bfile) => {
    let cfiles = getFiles(bfile, regex, regexElement, extensions)
    if (cfiles) {
      files = [...files, ...cfiles]
    }
  })
  if (files.length > 0) {
    return files
  }
  return undefined
}

const compareLastModifiedTimeWithDeps = (regex, regexElement, extensions) => {
  return (stream, cb, sourceFile, targetPath) => {
    fs.stat(targetPath, function (err, targetStat) {
      if (!fsOperationFailed(stream, sourceFile, err) && sourceFile.stat) {
        if (sourceFile.stat.mtime > targetStat.mtime) {
          stream.push(sourceFile)
        } else {
          const files = getFiles(sourceFile.path, regex, regexElement, extensions)
          if (files) {
            let changed = false
            files.forEach((file) => {
              if (fs.statSync(file).mtime > targetStat.mtime) {
                changed = true
              }
            })
            if (changed) {
              stream.push(sourceFile)
            }
          }
        }
      }
      cb()
    })
  }
}

module.exports.getFiles = getFiles
module.exports.compareLastModifiedTimeWithDeps = compareLastModifiedTimeWithDeps
module.exports.compareLastModifiedTimeCSSDeps = compareLastModifiedTimeWithDeps(/@import\s+(["'])(.*?)(["'])/gm, 2, ['', '.css', '.sss'])
module.exports.compareLastModifiedTimeJSDeps = compareLastModifiedTimeWithDeps(/import\s+.+\s+from\s+(["'])(.*?)(["'])/gm, 2, ['', '.js', '.jsx'])
module.exports.compareLastModifiedTimePugDeps = compareLastModifiedTimeWithDeps(/(include|extends?)\s(.*)/gm, 2, ['', '.pug', '.jade'])

