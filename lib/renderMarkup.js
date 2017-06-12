const Parser = require('xmldom').DOMParser
const { pd } = require('pretty-data')
const indentString = require('indent-string')
const css = require('css')
const { pathProps } = require('./react-native-svg/props')
const camelCase = require('camelcase')

const validKeys = Object.keys(pathProps)

const enabledTags = [
  'svg',
  'circle',
  'ellipse',
  'g',
  'linearGradient',
  'radialGradient',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'symbol',
  'text',
  'use',
  'defs',
  'stop',
  'style'
]

let usedTags = new Set()
let cssRules = []

function forEach (context, callback) {
  return [].forEach.call(context, callback)
}

function map (context, callback) {
  return [].map.call(context, callback)
}

function filter (context, callback) {
  return [].filter.call(context, callback)
}

function iterateMarkup (markup, config, i = 0) {
  let tagName = markup.nodeName

  if (enabledTags.indexOf(tagName) === -1) {
    return ''
  }

  let attrs = []

  if (tagName === 'svg') {
    let viewBox = markup.attributes ? filter(markup.attributes, attr => attr.name === 'viewBox')[0] : false
    viewBox = viewBox ? viewBox.value.split(' ') : false

    attrs.push({
      name: 'width',
      value: viewBox ? `{props.width || ${viewBox[2]}}` : `{props.width}`
    })
    attrs.push({
      name: 'height',
      value: viewBox ? `{props.height || ${viewBox[3]}}` : `{props.height}`
    })
    attrs.push({
      name: 'viewBox',
      value: viewBox ? `\"${viewBox.join(' ')}\"` : '0 0 50 50'
    })
  } else if (tagName === 'style') {
    const cssAST = css.parse(markup.firstChild.data)
    cssRules = cssAST.stylesheet.rules
    return ''
  } else {
    let cssProps = []
    let className
    // Find classes and match attributes from rule declarations
    forEach(markup.attributes, attr => {
      if (attr.name === 'class') {
        className = '.' + attr.value
        const rules = filter(cssRules, rule => {
          if (rule.selectors.indexOf(className) > -1) {
            return true
          } else {
            return false
          }
        })
        forEach(rules, rule => {
          forEach(rule.declarations, declaration => {
            const propertyName = camelCase(declaration.property)

            if (config.reactNative) {
              // Compare against whitelist/proptypes from react-native-svg props in validKeys
              if (validKeys.indexOf(propertyName) > -1) {
                // Since Svg doesn't support a color style...
                let propertyValue
                if (config.color && propertyName === 'fill') {
                  propertyValue = `{props.color || "${declaration.value}"}`
                } else {
                  propertyValue = `\"${declaration.value}\"`
                }
                attrs.push({
                  name: propertyName,
                  value: propertyValue
                })
                cssProps.push(propertyName)
              }
            } else {
              attrs.push({
                name: propertyName,
                value: `\"${declaration.value}\"`
              })
              cssProps.push(propertyName)
            }
          })
        })
      }
    })
    forEach(markup.attributes, attr => {
      const propertyName = camelCase(attr.name)

      if (propertyName === 'class') {
        return
      }

      if (cssProps.indexOf(propertyName) > -1) {
        return
      }

      let propertyValue
      if (config.color && propertyName === 'fill') {
        propertyValue = `{props.color || "${attr.value}"}`
      } else {
        propertyValue = `\"${attr.value}\"`
      }

      attrs.push({
        name: propertyName,
        value: propertyValue
      })
    })

    if (config.reactNative && config.color) {
      let fillAttr = filter(attrs, attr => {
        if (attr.name === 'fill') {
          return true
        } else {
          return false
        }
      })
      if (fillAttr.length === 0) {
        attrs.push({
          name: 'fill',
          value: '{props.color || undefined}'
        })
      }
    }
  }

  if (config.reactNative) {
    tagName = tagName[0].toUpperCase() + tagName.slice(1)
    if (tagName !== 'Svg') {
      usedTags.add(tagName)
    } else {
      if (config.coffeescript) {
        tagName = 'Svg.Svg'
      }
    }
  }

  const children = markup.childNodes.length ? map(markup.childNodes, child => {
    return iterateMarkup(child, config, ++i)
  }).join('\n') : ''

  let tag
  if (tagName === 'Svg' || tagName === 'Svg.Svg') {
    tag = `<${tagName} {...props} ${map(attrs, attr => `${attr.name}=${attr.value}`).join(' ')}>${children}</${tagName}>`
  } else {
    tag = `<${tagName} ${map(attrs, attr => `${attr.name}=${attr.value}`).join(' ')}>${children}</${tagName}>`
  }

  return tag
}

module.exports = (svgString, config) => {
  let markup = (new Parser()).parseFromString(svgString, 'image/svg+xml')

  const outputString = `${iterateMarkup(markup.childNodes[0], config)}`

  return {
    outputString: indentString(pd.xml(outputString), 2),
    usedTags: usedTags
  }
}
