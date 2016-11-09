const path = require('path')
const fs = require('fs')
const log = require('./customLogger')

const isPathValid = (pathString, type) => {
  let stats

  // If path is relative
  if (pathString[0] === '.' || pathString !== '/') {
    pathString = path.resolve(process.cwd(), pathString)
  }

  try {
    stats = fs.lstatSync(pathString)
  } catch (error) {
    return false
  }

  if (type === 'directory') {
    return stats.isDirectory()
  } else if (type === 'file') {
    return stats.isFile()
  } else if (type === 'any') {
    return stats.isDirectory() || stats.isFile()
  } else {
    return false
  }
}

module.exports = config => {
  let svgSources = []

  if (!isPathValid(config.pathToFiles, 'any')) {
    log.error('\nmsvgc --folder [pathToFiles], path to directory with .svg files or concrete file\n')
    process.exit(1)
  }

  if (isPathValid(config.pathToFiles, 'directory')) {
    const dirContent = fs.readdirSync(config.pathToFiles)
    dirContent.forEach(content => {
      let filePath = path.resolve(config.pathToFiles, content)
      if (isPathValid(filePath, 'file') && path.extname(filePath) === '.svg') {
        svgSources.push(content)
      }
    })

    log.help(JSON.stringify(svgSources))
  }

  if (!isPathValid(config.targetPath, 'directory')) {
    log.error('\nmsvgc --output [targetPath], path must be path to folder\n')
    process.exit(1)
  }
}
