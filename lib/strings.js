module.exports = {
  import: {
    react: () => `import React from "react";`,
    reactOnTypescript: () => `import * as React from "react";`,
    reactOnCoffeescript: () => `React = require 'react'`,
    reactNaiveSvg: svgTags => `import Svg, { ${svgTags.join(', ')} } from "react-native-svg";`,
    reactNaiveSvgOnCoffeescript: svgTags => `Svg = require 'react-native-svg'
{ ${svgTags.join(', ')} } = Svg`
  },
  componentDeclaration: componentName => `\nconst ${componentName} = props => (`,
  componentDeclarationTypescript: componentName => `\nconst ${componentName} = (props: any) => (`,
  endOfDeclaration: () => `);`,
  exportingString: componentName => `\nexport default ${componentName};`,
  exportingStringOnTypescript: componentName => `\nexport = ${componentName}`,
  componentDeclarationOnCoffeescript: componentName => `\n${componentName} = (props) ->`,
  endOfDeclarationOnCoffeescript: () => ``,
  exportingStringOnCoffeescript: componentName => `\nmodule.exports = ${componentName}`,
  startImportString: () => `module.exports = {`,
  startImportStringTypescript: () => `export default {`,
  componentsRequireString: ({componentName, componentPath}) => `\n  ${componentName}: require('${componentPath}')`,
  componentsRequireStringOnCoffeescript: ({componentName, componentPathOnCoffeescript}) => `\n  ${componentName}: require('${componentPathOnCoffeescript}')`,
  endImportString: () => `}`
}
