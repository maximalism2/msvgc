const help = require('./help')
const log = require('./customLogger')
const path = require('path')

const defaultConfig = {
  pathToFiles: process.cwd(),
  targetPath: process.cwd(),
  indexPath: undefined,
  svgPath: undefined,
  reactNative: false,
  typescript: false,
  coffeescript: false,
  camelCase: false,
  color: false,
  fileExt: undefined
}

module.exports = argv => {
  let config = defaultConfig

  if (argv.includes('-h') || argv.includes('--help')) {
    help.show()
    process.exit()
  }

  for (let i = 0; i < argv.length; i += 1) {
    let argument = argv[i]

    switch (argument) {
      case '-f':
      case '--folder': {
        config.pathToFiles = path.resolve(argv[i += 1])
        break
      }
      case '-o':
      case '--output': {
        config.targetPath = argv[i += 1]
        break
      }
      case '--react-native': {
        config.reactNative = true
        break
      }
      case '--typescript': {
        config.typescript = true
        break
      }
      case '--coffeescript': {
        config.coffeescript = true
        break
      }
      case '--camelCase': {
        config.camelCase = true
        break
      }
      case '--color': {
        config.color = true
        break
      }
      default: {
        log.any('Warn', 'Unknown option', argument)
      }
    }
  }

  config.svgPath = path.resolve(config.targetPath, 'svg')

  if (config.typescript) {
    config.fileExt = '.tsx'
  } else if (config.coffeescript) {
    config.fileExt = '.cjsx'
  } else {
    config.fileExt = '.js'
  }

  config.indexPath = path.join(config.svgPath, 'index' + config.fileExt)

  return config
}
