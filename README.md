# MSVGC

Utils for generating react components from plain svg files <br />
*(compatible with react-native)*

### Install:
```bash
# install package globally
npm install -g msvgc
```
### Usage:
```bash
# provide for utils
msvgc -f ./path/to/pic.svg -o ./svgComponents/
```

`--camelCase` flag creates components with camel-case class names

`--react-native` flag creates components using [react-native-svg](https://github.com/react-native-community/react-native-svg) library

`--color` flag creates react-native components with color props pased to the svg children's fill prop

`--typescript` flag will use typescript import statements e.g. (`import * as React`)

`--coffeescript` flag will use CoffeeScript CJSX syntax for creating components

<br />
Then use generated components in your jsx/tsx/cjsx files:

```js
[...]

import Pic from './svgComponents/Pic'

class MyComponent extends Component {
  render() {
    return (
      <div>
        <Pic width={300} height={100} />
        <p>Lorem ipsum...</p>
      </div>
    );
  }
}

[...]
```

#### TODO:
- [x] do creating index file in components directory for exporting created files
- [ ] do comparating with existing files in target component directory
