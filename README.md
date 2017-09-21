# [<img src="logo.png" alt="quark-state" width="200">](https://github.com/fm-ph/quark-state)

[![build status][travis-image]][travis-url]
[![stability][stability-image]][stability-url]
[![npm version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

Simple state manager based on [__Singleton__](https://en.wikipedia.org/wiki/Singleton_pattern) design pattern.

___This package is part of `quark` framework but it can be used independently.___

## Installation

[![NPM](https://nodei.co/npm/quark-state.png)](https://www.npmjs.com/package/quark-state)

```sh
npm install quark-state --save
```

## Usage

### Basic

Initialize a container and set/get a prop.

```js
import State from 'quark-state'

const initialUserState = {
  'name': 'John Doe',
  'age': 36,
  'location': {
    'latitude': 34.564756,
    'longitude': 32.804872
  }
}

// Initialize a container
State.initContainer('USER', initialUserState)

// Get a prop from a container
const name = State.get('USER.name') // = 'John Doe'

// Set a prop on a container
State.set('USER.age', 40)
```

### Container

#### Init a container

```js
import State from 'quark-state'

const initialContainerState = {}
State.initContainer('CONTAINER', initialContainerState)
```

#### Destroy a container

```js
import State from 'quark-state'

State.destroyContainer('CONTAINER')
```

### Clear

Clear the State by destroying all containers

```js
import State from 'quark-state'

const initialContainerState = {}
State.initContainer('CONTAINER', initialContainerState)

State.clear()
```

### Set

#### Set a (deep) prop

```js
import State from 'quark-state'

const initialContainerState = {
  'deep': {
    'prop': true
  }
}
State.initContainer('CONTAINER', initialContainerState)

State.set('CONTAINER.deep.prop', false)
```

#### Set an object prop (merge)

```js
import State from 'quark-state'

const initialContainerState = {
  'deep': {
    'prop': {
      'integer': 10,
      'boolean': true
    }
  }
}
State.initContainer('CONTAINER', initialContainerState)

// By default, it will merge the two objects
State.set('CONTAINER.deep.prop', {
  'integer': 20,
  'string': 'foo'
})
```

#### Set an object prop (overwrite)

```js
import State from 'quark-state'

const initialContainerState = {
  'deep': {
    'prop': {
      'integer': 10,
      'boolean': true
    }
  }
}
State.initContainer('CONTAINER', initialContainerState)

// If you set the third argument to true, it will overwrite the prop value
State.set('CONTAINER.deep.prop', { 'integer': 20 }, true)
```

### Get

```js
import State from 'quark-state'

const initialContainerState = {
  'boolean': true
}
State.initContainer('CONTAINER', initialContainerState)

State.get('CONTAINER.boolean') // = true
```

### Has

Check if the given query exists (container or prop)

```js
import State from 'quark-state'

const initialContainerState = {
  'string': 'foo'
}
State.initContainer('CONTAINER', initialContainerState)

State.has('CONTAINER') // = true
State.has('CONTAINER.foo') // = true
State.has('CONTAINER.doesNotExist') // = false
```

### On change

#### Add

When a prop is modified, call a callback with old and new values

```js
import State from 'quark-state'

const initialContainerState = {
  'string': 'foo',
  'deep': {
    'prop': true
  }
}
State.initContainer('CONTAINER', initialContainerState)

// When a prop is modified, callback is called
State.onChange('CONTAINER.string', (oldVal, newVal) => { }) // oldVal = 'foo', newVal = 'bar'
State.set('CONTAINER.string', 'bar')

// When a deep prop is modified, it also triggers parent callback
State.onChange('CONTAINER', (oldVal, newVal) => { }) // oldVal = true, newVal = false
State.set('CONTAINER.deep.prop', false)
```

#### Remove

```js
import State from 'quark-state'

const initialContainerState = {
  'string': 'foo',
  'deep': {
    'prop': true
  }
}
State.initContainer('CONTAINER', initialContainerState)

const callback = (oldVal, newVal) => { } // Won't be trigger

State.onChange('CONTAINER.string', callback)
State.removeChangeCallback('CONTAINER.string', callback)

State.set('CONTAINER.string', 'bar')
```

## API

See [https://fm-ph.github.io/quark-state/](https://fm-ph.github.io/quark-state/)

## Build

To build the sources with `babel` in `./lib` directory :

```sh
npm run build
```

## Documentation

To generate the `JSDoc` :

```sh
npm run docs
```

To generate the documentation and deploy on `gh-pages` branch :

```sh
npm run docs:deploy
```

## Testing

To run the tests, first clone the repository and install its dependencies :

```sh
git clone https://github.com/fm_ph/quark-state.git
cd quark-state
npm install
```

Then, run the tests :

```sh
npm test
```

To watch (test-driven development) :

```sh
npm run test:watch
```

For coverage :

```sh
npm run test:coverage
```

## License

MIT [License](LICENSE.md) © [Patrick Heng](http://hengpatrick.fr/) [Fabien Motte](http://fabienmotte.com/)

[travis-image]: https://img.shields.io/travis/fm-ph/quark-state/master.svg?style=flat-square
[travis-url]: http://travis-ci.org/fm-ph/quark-state
[stability-image]: https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/quark-state.svg?style=flat-square
[npm-url]: https://npmjs.org/package/quark-state
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
