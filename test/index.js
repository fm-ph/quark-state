import test from 'ava'

import State from '../src/index'

test('Initialize a container', t => {
  const initObj = {
    message: 'hello world'
  }

  State.initContainer('TEST', initObj)
  t.is(State.get('TEST'), initObj)
})
