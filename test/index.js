import test from 'ava'

import State from '../src/index'
import fixtureUser from './fixtures/user'
import fixtureLoader from './fixtures/loader'

test.beforeEach(t => {
  State.clear() // Clear the State before each test

  // Initialize the State with fixtures data
  State.initContainer('USER', fixtureUser)
  State.initContainer('LOADER', fixtureLoader)
})

/**
 * initContainer method
 */
test('initialize a container', t => {
  t.deepEqual(State.get('USER'), fixtureUser)
})

test('initialize a container with a bad type value throws a type error', t => {
  const error = t.throws(() => State.initContainer('TEST', null), TypeError)

  t.is(error.message, 'State.initContainer() : Second argument must be an Object')
})

/**
 * destroyContainer method
 */
test('destroy a container', t => {
  State.destroyContainer('USER')
  t.false(State.has('USER'))
})

test('destroy a container that does not exist throws an error', t => {
  const error = t.throws(() => State.destroyContainer('DOES_NOT_EXIST'), Error)

  t.is(error.message, 'State.destroyContainer() : Cannot destroy a container that does not exist')
})

/**
 * clear method
 */
test('clear the state', t => {
  State.clear()
  t.deepEqual(State._containers, {})
})

/**
 * set/get methods
 */
test('set/get a prop', t => {
  State.set('USER.gender', 'male')
  t.is(State.get('USER.gender'), 'male')
})

test('set/get a deep prop', t => {
  State.set('USER.location.latitude', 10)
  t.is(State.get('USER.location.latitude'), 10)
})

test('set an object prop that already exists (merge)', t => {
  State.set('USER.location', {
    'latitude': 10
  })

  t.deepEqual(State.get('USER.location'), {
    'latitude': 10,
    'longitude': fixtureUser.location.longitude
  })
})

test('set an object prop that already exists (forced)', t => {
  State.set('USER.location', {
    'latitude': 10
  }, true)

  t.deepEqual(State.get('USER.location'), {
    'latitude': 10
  })
})

/**
 * get method
 */
test('get a prop from a container that does not exist throws an error', t => {
  const error = t.throws(() => State.get('DOES_NOT_EXIST.prop'), Error)

  t.is(error.message, 'State.get() : Cannot get a value from a container that does not exist')
})

/**
 * set method
 */
test('set a prop on a container that does not exist throws an error', t => {
  const error = t.throws(() => State.set('DOES_NOT_EXIST.prop', true), Error)

  t.is(error.message, 'State.set() : Cannot set a value on a container that does not exist')
})

/**
 * has method
 */
test('has a container that exists', t => {
  t.true(State.has('LOADER'))
})

test('has a container that does not exist', t => {
  t.false(State.has('DOES_NOT_EXIST'))
})

test('has a prop that exists', t => {
  t.true(State.has('LOADER.loaded'))
})

test('has a prop that does not exist', t => {
  t.false(State.has('LOADER.doesNotExist'))
})

/**
 * onChange method
 */
test.cb('when a prop change the callback is called', t => {
  State.onChange('LOADER.loaded', (oldVal, newVal) => {
    t.false(oldVal)
    t.true(newVal)
    t.end()
  })

  State.set('LOADER.loaded', true)
})

test('when a prop does not change nothing is called', t => {
  State.onChange('LOADER.loaded', (oldVal, newVal) => {
    t.fail()
  })

  State.set('LOADER.loaded', false)
})

test.cb('when a deep prop change the callback is called', t => {
  State.onChange('USER.location.latitude', (oldVal, newVal) => {
    t.is(oldVal, fixtureUser.location.latitude)
    t.is(newVal, 10)
    t.end()
  })

  State.set('USER.location.latitude', 10)
})

test.cb('when a deep prop change a parent object callback is called', t => {
  State.onChange('USER.location', (oldVal, newVal) => {
    t.is(oldVal, fixtureUser.location.latitude)
    t.is(newVal, 10)
    t.end()
  })

  State.set('USER.location.latitude', 10)
})

test.cb('when a deep prop change a container callback is called', t => {
  State.onChange('USER', (oldVal, newVal) => {
    t.is(oldVal, fixtureUser.location.longitude)
    t.is(newVal, 10)
    t.end()
  })

  State.set('USER.location.longitude', 10)
})

test.cb('when a deep object prop change a callback is called', t => {
  State.onChange('USER', (oldVal, newVal) => {
    t.deepEqual(oldVal, fixtureUser.location)
    t.deepEqual(newVal, { 'latitude': 10, 'longitude': fixtureUser.location.longitude })
    t.end()
  })

  State.set('USER.location', {
    'latitude': 10,
    'longitude': fixtureUser.location.longitude
  })
})

test('add a change callback with a bad type value throws an error', t => {
  const error = t.throws(() => State.onChange('USER', null), Error)

  t.is(error.message, 'State.onChange() : Second argument must be a Function')
})

test('add a change callback on a container that does not exist throws an error', t => {
  const error = t.throws(() => State.onChange('DOES_NOT_EXIST', (oldVal, newVal) => { }), Error)

  t.is(error.message, 'State.onChange() : Cannot add a change callback on a container that does not exist')
})

/**
 * removeChangeCallback method
 */
test('remove a change callback on a prop', t => {
  const cb = (oldVal, newVal) => { }
  State.onChange('LOADER.loaded', cb)

  State.removeChangeCallback('LOADER.loaded', cb)
})

test('remove a change callback on a deep prop', t => {
  const cb = (oldVal, newVal) => { }
  State.onChange('USER.location.latitude', cb)

  State.removeChangeCallback('USER.location.latitude', cb)
})

test('remove a change callback on a container', t => {
  const cb = (oldVal, newVal) => { }
  State.onChange('USER', cb)

  State.removeChangeCallback('USER', cb)
})

test('remove a change callback with a bad type throws a type error', t => {
  const error = t.throws(() => State.removeChangeCallback('USER', null), TypeError)

  t.is(error.message, 'State.removeChangeCallback() : Second argument must be a Function')
})

test('remove a change callback on a container that does not exist throws an error', t => {
  const error = t.throws(() => State.removeChangeCallback('DOES_NOT_EXIST', (oldVal, newVal) => { }), Error)

  t.is(error.message, 'State.removeChangeCallback() : Cannot remove a change callback on a container that does not exist')
})

test('remove a change callback with a query that does not have a signal throws an error', t => {
  const error = t.throws(() => State.removeChangeCallback('USER.location', (oldVal, newVal) => { }), Error)

  t.is(error.message, `State.removeChangeCallback() : No signal found to remove a change callback with query : 'USER.location'`)
})

/**
 * _parseStateQuery method
 */
test('parse a query with a bad type throws an error', t => {
  const error = t.throws(() => State._parseStateQuery(null), TypeError)

  t.is(error.message, 'State : Query argument must be a string')
})
