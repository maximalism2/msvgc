const path = require('path')
const colors = require('colors/safe')
const help = require('./lib/help')

colors.setTheme({
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
})

const log = {
  error: message => {
    console.log(colors.error(message))
  },
  help: message => {
    console.log(colors.help(message))
  },
  any: (type, message, arg) => {
    if (!type) {
      return null
    }

    type = colors[type.toLowerCase()](type)
    message = colors.prompt(message + ':')

    console.log(`${type} / ${message} ${arg}`)
  }
}

const defaultConfig = {
  pathToFiles: '',
  targetPath: '',
  reactNative: false,
  typescript: false
}

function checkArguments (argv) {
  let config = defaultConfig

  for (let i = 0; i < argv.length; i += 1) {
    let argument = argv[i]

    switch (argument) {
      case '-f':
      case '--folder': {
        config.pathToFiles = argv[i += 1]
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
      case '--help': {
        help.show()
        process.exit()
        break
      }
      default: {
        log.any('Warn', 'Unknown option', argument)
      }
    }
  }

  if (!config.pathToFiles) {
    config.pathToFiles = path.resolve(__dirname)
  }

  console.log(JSON.stringify(config))
}

// Entry point
(() => {
  checkArguments(process.argv.slice(2))
})()
