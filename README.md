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

`--color` flag creates react-native components with color props passed to the svg children's fill prop

`--typescript` flag will use typescript import statements e.g. (`import * as React`)

`--coffeescript` flag will use CoffeeScript CJSX syntax for creating components

**Notes:**

If default params are not set, the current working
directory will be used as the path to .svg files with output in the ./svg directory.

Subdirectories containing .svg files will generate their corresponding react components within a subdirectory in the output path.

The output path contains an index.js that exports all generated components.

### React JS:
Use generated components in your jsx/tsx/cjsx files:

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
- [x] Create index file in target component directory.
  - [ ] Provide warning when duplicate component names exist in the index.
- [ ] Compare existing files in target component directory.
