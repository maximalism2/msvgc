const fs = require('fs')
const path = require('path')
const log = require('./customLogger')

function concatFileContent (content) {
  return `${content.reactImportString}
${content.svgLibImportString}
${content.componentDeclarationString}
${content.markup}
${content.endOfDeclaration}
${content.exportingString}
`
}

function createFile (content, name, targetPath, ts) {
  let filePath = path.join(targetPath, name + (ts ? '.tsx' : '.js'))
  let fileData = concatFileContent(content)

  fs.writeFile(filePath, fileData, (err) => {
    if (err) {
      log.error(err)
    }

    log.any('Info', 'svg component was created successful', filePath)
  })
}

module.exports = (fileStrings, componentName, config) => {
  fs.readdir(config.targetPath, (err, data) => {
    if (err) {
      log.error(err)
    }

    if (data.length) {
      data.forEach((contentItem, index) => {
        let isSvgFolderExists = false

        fs.lstat(path.resolve(config.targetPath, contentItem), (statsError, stats) => {
          if (statsError) {
            log.error(statsError)
          }

          if (stats.isDirectory() && contentItem === 'svg') {
            createFile(fileStrings, componentName, path.resolve(config.targetPath, contentItem), config.typescript)
            isSvgFolderExists = true
          }

          if (!isSvgFolderExists && index + 1 === data.length) {
            fs.mkdir(path.resolve(config.targetPath, 'svg'), (exeption) => {
              if (exeption) {
                log.error('sfsdfsdfdsfsd' + exeption)
              }

              createFile(fileStrings, componentName, path.resolve(config.targetPath, 'svg'), config.typescript)
            })
          }
        })
      })
    } else {
      fs.mkdir(path.resolve(config.targetPath, 'svg'), (exeption) => {
        if (exeption) {
          log.error(exeption)
        }

        createFile(fileStrings, componentName, path.resolve(config.targetPath, 'svg'), config.typescript)
      })
    }
  })
}
