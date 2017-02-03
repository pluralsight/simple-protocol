# Effects as Data Http

Everything you need for handling HTTP effects.

### Usage
```js
const { run } = require('effects-as-data')
const { handlers, actions } = require('simple-protocol')

function * witty () {
  let result = yield actions.httpGet('https://api.github.com/zen')
  return result
}

run(handlers, witty).then(({payload}) => {
  console.log(payload) // something witty
})
```
