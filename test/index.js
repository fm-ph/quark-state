import test from 'ava'

import Simple from '../src/index'

test.beforeEach(t => {
  t.context.simple = new Simple()
})

test('simple test', t => {
  t.is(t.context.simple.test(), 'Hello world')
})
