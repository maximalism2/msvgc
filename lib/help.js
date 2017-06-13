const helpMessage = `
Usage:

  msvgc -f <pathToFiles> -o <targetPath>

If default params are not set, the current working
directory will be used as the path to .svg files with output in the ./svg directory

msvgc --camelCase     create components with camel-case class names

msvgc --react-native  create react svg components using react-native-svg library
                      https://github.com/react-native-community/react-native-svg

msvgc --color         create react-native components with color props passed to the svg children's fill prop

msvgc --typescript    prepare output files using TypeScript syntax

msvgc --coffeescript  prepare output files using CoffeeScript syntax
`

exports.show = () => console.log(helpMessage)
