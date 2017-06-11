const fs = require('fs-extra')
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

function createFile (content, name, targetPath, config) {
  let componentDirName
  let componentFilename
  let componentFilePath
  let filePath = path.join(targetPath, name + config.fileExt)
  let fileData = concatFileContent(content)
  return new Promise((resolve, reject) => {
      fs.writeFile(filePath, fileData, (err) => {
        if (err) {
          reject(err)
        } else {
          componentFilePath = './' + filePath.replace(config.svgPath, '').replace(/^\//, '').replace(/^\./, '')
          const filename = path.basename(componentFilePath, config.fileExt)
          componentDirName = path.dirname(componentFilePath)
          componentFilename = './' + path.join(componentDirName, filename)

          let componentInfo = {
            componentName: name,
            componentPathOnCoffeescript: componentFilename,
            componentPath: componentFilePath
          }
          log.any('Info', 'svg component was created successful', filePath)
          resolve(componentInfo)
        }
      })
  })
}

module.exports = (fileStrings, componentName, subDirName, config) => {
  return new Promise((resolve, reject) => {
    let svgPath = path.resolve(config.targetPath, 'svg')
    fs.ensureDir(svgPath, (err) => {
      if (err) {
        reject(err)
      } else {

        let destPath
        if (subDirName) {
          destPath = path.resolve(path.join(svgPath, subDirName))

          fs.ensureDir(destPath, (err) => {
            if (err) {
              reject(err)
            } else {
              createFile(fileStrings, componentName, destPath, config)
              .then((componentInfo)=>{
                resolve(componentInfo)
              }).catch((err)=>{
                reject(err)
              })
            }
          })
        } else {
          createFile(fileStrings, componentName, svgPath, config)
          .then((componentInfo)=>{
            resolve(componentInfo)
          }).catch((err)=>{
            reject(err)
          })
        }
      }
    })
  })
}
