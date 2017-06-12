module.exports = {
  import: {
    react: () => `import React from "react";`,
    reactOnTypescript: () => `import * as React from "react";`,
    reactNaiveSvg: svgTags => `import Svg, { ${svgTags.join(', ')} } from "react-native-svg";`
  },
  componentDeclaration: componentName => `\nconst ${componentName} = props => (`,
  endOfDeclaration: () => `);`,
  exportingString: componentName => `\nexport default ${componentName};`,
  startImportString: () => `module.exports = {`,
  componentsRequireString: ({componentName, componentPath}) => `\n  ${componentName}: require('${componentPath}')`,
  endImportString: () => `}`
}
