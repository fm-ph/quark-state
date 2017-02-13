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

/**
 * destroyContainer method
 */
test('destroy a container', t => {
  State.destroyContainer('USER')
  t.false(State.has('USER'))
})

test('destroy a container that does not exist', t => {
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
test('get a prop from a container that does not exist', t => {
  const error = t.throws(() => State.get('DOES_NOT_EXIST.prop'), Error)

  t.is(error.message, 'State.get() : Cannot get a value from a container that does not exist')
})

/**
 * set method
 */
test('set a prop on a container that does not exist', t => {
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
