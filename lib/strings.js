module.exports = {
  import: {
    react: () => `import React from "react";`,
    reactOnTypescript: () => `import * as React from "react";`,
    reactOnCoffeescript: () => `React = require 'react'`,
    reactNaiveSvg: svgTags => `import Svg, { ${svgTags.join(', ')} } from "react-native-svg";`,
    reactNaiveSvgOnCoffeescript: svgTags => `Svg = require 'react-native-svg'
{ ${svgTags.join(', ')} } = Svg`
  },
  coffeeImport: {
    react: () => ``,
    reactNaiveSvg: svgTags => `import Svg, { ${svgTags.join(', ')} } from "react-native-svg";`
  },
  componentDeclaration: componentName => `\nconst ${componentName} = props => (`,
  endOfDeclaration: () => `);`,
  exportingString: componentName => `\nexport default ${componentName};`,
  exportingStringOnTypescript: componentName => `\nexport = ${componentName}`,
  componentDeclarationOnCoffeescript: componentName => `\n${componentName} = (props) ->`,
  endOfDeclarationOnCoffeescript: () => ``,
  exportingStringOnCoffeescript: componentName => `\nmodule.exports = ${componentName}`,
  startImportString: () => `module.exports = {`,
  componentsRequireString: ({componentName, componentPath}) => `\n  ${componentName}: require('${componentPath}')`,
  endImportString: () => `}`
}
