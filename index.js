#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')

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

const getCSSFiles = (file) => {
  let files = []
  const fileDirname = path.dirname(file)
  const data = fs.readFileSync(file, 'utf8')
  const regex = /@import\s+(["'])(.*?)(["'])/gm
  let result = regex.exec(data)
  while (result) {
    files.push(result[2])
    result = regex.exec(data)
  }
  files = files.map((file) => {
    file = path.join(fileDirname, file)
    try {
      if (fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index')
      }
    } catch (err) {}
    try {
      fs.accessSync(file, fs.R_OK)
      return file
    } catch (err) {}
    try {
      fs.accessSync(`${file}.css`, fs.R_OK)
      return `${file}.css`
    } catch (err) {}
    try {
      fs.accessSync(`${file}.sss`, fs.R_OK)
      return `${file}.sss`
    } catch (err) {}
    return null
  })
  files = files.filter((file) => file)
  const bfiles = files.slice()
  bfiles.forEach((bfile) => {
    let cfiles = getCSSFiles(bfile)
    if (cfiles) {
      cfiles.forEach((cfile) => {
        files[files.length] = cfile
      })
    }
  })
  if (files.length > 0) {
    return files
  } else {
    return undefined
  }
}

const getJSFiles = (file) => {
  let files = []
  const fileDirname = path.dirname(file)
  const data = fs.readFileSync(file, 'utf8')
  const regex = /import\s+.+\s+from\s+(["'])(.*?)(["'])/gm
  let result = regex.exec(data)
  while (result) {
    files.push(result[2])
    result = regex.exec(data)
  }
  files = files.map((file) => {
    file = path.join(fileDirname, file)
    try {
      if (fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index')
      }
    } catch (err) {}
    try {
      fs.accessSync(file, fs.R_OK)
      return file
    } catch (err) {}
    try {
      fs.accessSync(`${file}.js`, fs.R_OK)
      return `${file}.js`
    } catch (err) {}
    try {
      fs.accessSync(`${file}.jsx`, fs.R_OK)
      return `${file}.jsx`
    } catch (err) {}
    try {
      fs.accessSync(`${file}.es6`, fs.R_OK)
      return `${file}.es6`
    } catch (err) {}
    try {
      fs.accessSync(`${file}.babel`, fs.R_OK)
      return `${file}.babel`
    } catch (err) {}
    return null
  })
  files = files.filter((file) => file)
  const bfiles = files.slice()
  bfiles.forEach((bfile) => {
    let cfiles = getJSFiles(bfile)
    if (cfiles) {
      cfiles.forEach((cfile) => {
        files[files.length] = cfile
      })
    }
  })
  if (files.length > 0) {
    return files
  } else {
    return undefined
  }
}

const getPugFiles = (file) => {
  let files = []
  const fileDirname = path.dirname(file)
  const data = fs.readFileSync(file, 'utf8')
  const regex = /(include|extend)\s(.*)/gm
  let result = regex.exec(data)
  while (result) {
    files.push(result[2])
    result = regex.exec(data)
  }
  files = files.map((file) => {
    file = path.join(fileDirname, file)
    try {
      if (fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index')
      }
    } catch (err) {}
    try {
      fs.accessSync(file, fs.R_OK)
      return file
    } catch (err) {}
    try {
      fs.accessSync(`${file}.pug`, fs.R_OK)
      return `${file}.pug`
    } catch (err) {}
    try {
      fs.accessSync(`${file}.jade`, fs.R_OK)
      return `${file}.jade`
    } catch (err) {}
    return null
  })
  files = files.filter((file) => file)
  const bfiles = files.slice()
  bfiles.forEach((bfile) => {
    let cfiles = getPugFiles(bfile)
    if (cfiles) {
      cfiles.forEach((cfile) => {
        files[files.length] = cfile
      })
    }
  })
  if (files.length > 0) {
    return files
  } else {
    return undefined
  }
}

const compareLastModifiedTimeCSSDeps = (stream, cb, sourceFile, targetPath) => {
  fs.stat(targetPath, function (err, targetStat) {
    if (!fsOperationFailed(stream, sourceFile, err) && sourceFile.stat) {
      if (sourceFile.stat.mtime > targetStat.mtime) {
        stream.push(sourceFile)
      } else {
        const files = getCSSFiles(sourceFile.path)
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

const compareLastModifiedTimeJSDeps = (stream, cb, sourceFile, targetPath) => {
  fs.stat(targetPath, function (err, targetStat) {
    if (!fsOperationFailed(stream, sourceFile, err) && sourceFile.stat) {
      if (sourceFile.stat.mtime > targetStat.mtime) {
        stream.push(sourceFile)
      } else {
        const files = getJSFiles(sourceFile.path)
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

const compareLastModifiedTimePugDeps = (stream, cb, sourceFile, targetPath) => {
  fs.stat(targetPath, function (err, targetStat) {
    if (!fsOperationFailed(stream, sourceFile, err) && sourceFile.stat) {
      if (sourceFile.stat.mtime > targetStat.mtime) {
        stream.push(sourceFile)
      } else {
        const files = getPugFiles(sourceFile.path)
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

module.exports.getCSSFiles = getCSSFiles
module.exports.compareLastModifiedTimeCSSDeps = compareLastModifiedTimeCSSDeps
module.exports.getJSFiles = getJSFiles
module.exports.compareLastModifiedTimeJSDeps = compareLastModifiedTimeJSDeps
module.exports.getPugFiles = getPugFiles
module.exports.compareLastModifiedTimePugDeps = compareLastModifiedTimePugDeps

