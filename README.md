# quark-state

[![build status][travis-image]][travis-url]
[![stability][stability-image]][stability-url]
[![npm version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

Simple state manager based on [__Singleton__](https://en.wikipedia.org/wiki/Singleton_pattern) design pattern.

___This package is part of `quark` framework but it can be used independently.___

## Installation

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
