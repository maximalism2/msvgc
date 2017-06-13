const path = require('path')
const fs = require('fs')
const SVGO = require('svgo')
const log = require('./customLogger')
const strings = require('./strings')
const renderMarkup = require('./renderMarkup')
const writeComponentsFile = require('./writeComponentsFile')
const writeComponentsIndex = require('./writeComponentsIndex')
const optimizer = new SVGO()
const camelCase = require('camelcase')

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

/**
 * Function to generate strings, which will be used in components file creating
 * @param {Array<Object>} filesTexts - array of object, consisting of svg file name and source
 * @param {Object}        config     - object with command settings
 * @return {Void}
 */
function generateComponentsStrings (filesTexts, config) {
  return new Promise((resolve, reject) => {
    let completedComponents = []
    filesTexts.forEach(svg => {
      let reactImportString
      let svgLibImportString
      let componentDeclarationString
      let endOfDeclaration
      let markup
      let exportingString

      if (config.typescript) {
        reactImportString = strings.import.reactOnTypescript()
      } else if (config.coffeescript) {
        reactImportString = strings.import.reactOnCoffeescript()
      } else {
        reactImportString = strings.import.react()
      }

      let camelComponentName
      if (config.camelCase) {
        camelComponentName = camelCase(svg.filename)
      } else {
        camelComponentName = svg.filename
      }

      componentName = camelComponentName[0].toUpperCase() + camelComponentName.slice(1)

      if (config.coffeescript) {
        componentDeclarationString = strings.componentDeclarationOnCoffeescript(componentName)
      } else {
        componentDeclarationString = strings.componentDeclaration(componentName)
      }

      markup = renderMarkup(svg.source, config)

      if (config.reactNative) {
        let usedTags = []
        markup.usedTags.forEach(tag => usedTags.push(tag))
        if (config.coffeescript) {
          svgLibImportString = strings.import.reactNaiveSvgOnCoffeescript(usedTags)
        } else {
          svgLibImportString = strings.import.reactNaiveSvg(usedTags)
        }
      } else {
        svgLibImportString = ''
      }

      if (config.coffeescript) {
        endOfDeclaration = strings.endOfDeclarationOnCoffeescript()
      } else {
        endOfDeclaration = strings.endOfDeclaration()
      }

      if (config.typescript) {
        exportingString = strings.exportingStringOnTypescript(componentName)
      } else if (config.coffeescript) {
        exportingString = strings.exportingStringOnCoffeescript(componentName)
      } else {
        exportingString = strings.exportingString(componentName)
      }

      writeComponentsFile({
        reactImportString: reactImportString,
        svgLibImportString: svgLibImportString,
        componentDeclarationString: componentDeclarationString,
        markup: markup.outputString,
        endOfDeclaration: endOfDeclaration,
        exportingString: exportingString
      }, componentName, svg.filepath, config)
      .then((componentInfo)=>{
        completedComponents.push(componentInfo)
        if (filesTexts.length === completedComponents.length) {
          resolve(completedComponents)
        }
      })
      .catch((err)=>{
        reject(err)
      })

    })
  })
}

function generateIndexStrings (completedComponents, config) {
  let startImportString
  let componentsRequireString
  let endImportString

  let componentRequires = []
  completedComponents.forEach(componentInfo => {
    if (config.coffeescript) {
      componentRequires.push(strings.componentsRequireStringOnCoffeescript(componentInfo))
    } else {
      componentRequires.push(strings.componentsRequireString(componentInfo))
    }
  })

  if (config.coffeescript) {
    startImportString = strings.startImportString()
  } else {
    startImportString = strings.startImportString()
  }

  componentsRequireString = componentRequires.join()

  if (config.coffeescript) {
    endImportString = strings.endImportString()
  } else {
    endImportString = strings.endImportString()
  }

  return writeComponentsIndex({
    startImportString: startImportString,
    componentsRequireString: componentsRequireString,
    endImportString: endImportString
  }, config.indexPath)
}

function optimizeSources (svgSources, config) {
  let filesTexts = []
  svgSources.forEach(content => {
    fs.readFile(content, 'utf8', (err, data) => {
      if (err) {
        log.error('generateComponents:optimizeSources: error: ' + err)
      }

      optimizer.optimize(data, res => {
        let sanitizedContent = content.replace(config.pathToFiles, '').replace(/^\//, '')

        let filename
        if (config.camelCase) {
          filename = camelCase(path.win32.basename(sanitizedContent, '.svg'))
        } else {
          filename = path.win32.basename(sanitizedContent, '.svg')
        }

        filepath = path.normalize(path.dirname(sanitizedContent)).replace(/^\.\//, '').replace(/^\./, '')
        filename = filename[0].toUpperCase() + filename.slice(1)
        fileTextConfig = {
          filepath: filepath,
          filename: filename,
          source: res.data
        }
        filesTexts.push(fileTextConfig)

        if (filesTexts.length === svgSources.length) {
          generateComponentsStrings(filesTexts, config)
          .then((completedComponents)=>{
            BuildIndex(completedComponents, config)
          })
          .catch((err)=>{
            throw 'generateComponentsStrings error: %s', err
          })
        }
      })
    })
  })
}

function BuildIndex (completedComponents, config) {
  generateIndexStrings(completedComponents, config)
  .then((indexPath)=>{
    log.any('info', 'Completed svg to component conversion!', indexPath)
  })
  .catch((err)=>{
    log.error('generateComponents:BuildIndex: error: ' + err)
  })
}

function getSVGPaths (currentPath, svgSources) {
  if (!isPathValid(currentPath, 'any')) {
    log.error('\nmsvgc --folder [pathToFiles], path to directory with .svg files or concrete file\n')
    process.exit(1)
  } else if (isPathValid(currentPath, 'directory')) {
    const dirContent = fs.readdirSync(currentPath)

    dirContent.forEach(content => {
      let filePath = path.resolve(currentPath, content)

      if (isPathValid(filePath, 'file') && path.extname(filePath) === '.svg') {
        svgSources.push(filePath)
      } else if (isPathValid(filePath, 'directory')) {
        getSVGPaths(filePath, svgSources)
      }
    })
  } else if (path.extname(currentPath) === '.svg') {
    svgSources.push(currentPath)
  }

  return svgSources
}

module.exports = config => {
  let svgSources = getSVGPaths(config.pathToFiles, [])

  if (!isPathValid(config.targetPath, 'directory')) {
    log.error('\nmsvgc --output [targetPath], path must be path to folder\n')
    process.exit(1)
  }

  optimizeSources(svgSources, config)
}
