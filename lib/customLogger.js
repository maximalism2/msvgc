const colors = require('colors/safe')

colors.setTheme({
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
})

module.exports = {
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
