#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')

const fileExistWithExtension = (options) => {
  options.prefix = options.prefix || []
  options.prefix.push('_')
  options.prefix.push('')
  options.index = options.index || []
  options.index.push('index')
  options.extensions = options.extensions || []
  options.extensions.push('')
  let fileWithExt = null
  options.index.forEach((indexFile) => {
    try {
      if (fs.statSync(options.file).isDirectory()) {
        options.file = path.join(options.file, indexFile)
      }
    } catch (err) {}
  })
  options.extensions.forEach((extension) => {
    options.prefix.forEach((prefix) => {
      const dirname = path.dirname(options.file)
      const basename = path.basename(`${options.file}`)
      if (fs.existsSync(`${dirname}/${prefix}${basename}${extension}`)) {
        fileWithExt = path.normalize(`${dirname}/${prefix}${basename}${extension}`)
      }
    })
  })

  return fileWithExt
}

const getFiles = function getFiles (file, options) {
  const prefix = options.prefix
  const index = options.index
  const extensions = options.extensions
  const regex = options.regex
  const regexElement = options.regexElement
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
    return fileExistWithExtension({
      file,
      prefix,
      index,
      extensions
    })
  })
  files = files.filter((file) => file)
  const bfiles = [...files]
  bfiles.forEach((bfile) => {
    const cfiles = getFiles(bfile, {
      prefix,
      index,
      extensions,
      regex,
      regexElement
    })
    if (cfiles) {
      files = [...files, ...cfiles]
    }
  })
  if (files.length > 0) {
    return files
  }
  return undefined
}

const compareLastModifiedTimeWithDeps = ( options) => {
  const regex = options.regex
  const regexElement = options.regexElement
  const extensions = options.extensions
  return function(stream, sourceFile, targetPath) {
    return stat(targetPath)
      .then(targetStat => {
        if (sourceFile.stat && sourceFile.stat.mtime > targetStat.mtime) {
          stream.push(sourceFile)
        } else {
          const files = getFiles(sourceFile.path, {
            regex,
            regexElement,
            extensions
          })
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
      })
  }
}

module.exports.getFiles = getFiles
module.exports.compareLastModifiedTimeWithDeps = compareLastModifiedTimeWithDeps
module.exports.compareLastModifiedTimeCSSDeps = compareLastModifiedTimeWithDeps({
  extensions: ['.css', '.sss'],
  regex: /@import\s+(["'])(.*?)(["'])/gm,
  regexElement: 2
})
module.exports.compareLastModifiedTimeJSDeps = compareLastModifiedTimeWithDeps({
  extensions: ['.js', '.jsx'],
  regex: /import.+(["'])(.*?)(["'])/gm,
  regexElement: 2
})
module.exports.compareLastModifiedTimePugDeps = compareLastModifiedTimeWithDeps({
  extensions: ['.pug', '.jade'],
  regex: /(include|extends?)\s(.*)/gm,
  regexElement: 2
})
