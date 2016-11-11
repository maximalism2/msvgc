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

`--react-native` flag create components using [react-native-svg](https://github.com/react-native-community/react-native-svg) library

`--typescript` flag will using react importing like in typescript (`import * as React`)

<br />
Then use generated components in your jsx/tsx files:
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
- [ ] do creating index file in components directory for exporting created files
- [ ] do comparating with existing files in target component directory
