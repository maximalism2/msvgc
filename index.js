const generateComponents = require('./lib/generateComponents')
const generateConfig = require('./lib/generateConfig');

// Entry point
(() => {
  const argv = process.argv.slice(2)
  const config = generateConfig(argv)

  if (config.error) {
    process.exit(1)
  }

  generateComponents(config)
})()
