const helpMessage = `
Usage:

  msvgc -f <pathToFiles> -o <targetPath>

If default params are not setted, there will be used files from current
directory, create output folder also in current directory.

msvgc --react-native  prepare output files to use SVG library for react-native
                      https://github.com/react-native-community/react-native-svg

msvgc --typescript    prepare output files to using with TypeScript
`

exports.show = () => console.log(helpMessage)
