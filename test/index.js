import test from 'ava'

import States from '../src/index'

test.beforeEach(t => {
  // t.context.simple = new Simple()
})

test('Set container', t => {
  const initObj = {
    message: 'hello world'
  }

  States.initContainer('TEST', initObj)

  t.is(States.containers['TEST'], initObj)
})
