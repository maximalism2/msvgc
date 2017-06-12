const fs = require('fs-extra')
const path = require('path')
const log = require('./customLogger')

function concatFileContent (content) {
  return `${content.startImportString}
${content.componentsRequireString}
${content.endImportString}
`
}

function createFile (content, indexPath) {
  let fileData = concatFileContent(content)
  return new Promise((resolve, reject) => {
    fs.writeFile(indexPath, fileData, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(indexPath)
      }
    })
  })
}

module.exports = (fileStrings, indexPath) => {
  return new Promise((resolve, reject) => {
    createFile(fileStrings, indexPath)
    .then((response)=>{
      resolve(response)
    }).catch((err)=>{
      reject(err)
    })
  })
}
