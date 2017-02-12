import Signal from 'quark-signal'
import isEquals from 'lodash.isequal'

class State {

  constructor () {
    this._containers = {}
  }

  get (query) {
    const { container, splittedQuery } = this._parseStateQuery(query)

    let value = container

    if (splittedQuery.length > 1) {
      for (let i = 1, l = splittedQuery.length; i < l; i++) {
        value = value[splittedQuery[i]]

        if (value === undefined || value === null) {
          break
        }
      }
    }

    return value
  }

  set (query, value, forced = false) {
    const { container, containerId, splittedQuery } = this._parseStateQuery(query)

    let target = this._containers
    for (let i = 0, l = splittedQuery.length; i < l; i++) {
      const p = splittedQuery[i]
      const oldVal = target[p]

      if (typeof target[p] !== 'object') {
        target[p] = {}
      }

      if (i === splittedQuery.length - 1) {
        if (typeof oldVal === 'undefined' || typeof value !== 'object' || value === null || forced) {
          target[p] = value
        } else {
          target[p] = {
            ...target,
            ...value
          }
        }
      }

      target = target[p]

      // Dispatch signal on change
      let signalId = containerId
      for (let j = 0; j < i; j++) {
        signalId += `_${splittedQuery[i]}`

        console.log(signalId)
        if (typeof container.signals[signalId] !== 'undefined') {
          if (!isEquals(oldVal, target)) {
            container.signals[signalId].dispatch(oldVal, target)
          }
        }
      }
    }
  }

  onChange (query, callback) {
    const { container, containerId, splittedQuery } = this._parseStateQuery(query)

    let signalId = containerId

    for (let i = 1, l = splittedQuery.length; i < l; i++) {
      signalId += `_${splittedQuery[i]}`
    }

    if (typeof container.signals[query] === 'undefined') {
      container.signals[signalId] = new Signal()
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Signal.onChange() : Second argument must be a Function')
    }

    container.signals[signalId].add(callback)
  }

  removeChangeCallback (query, callback) {
    const { container } = this._parseStateQuery(query)

    if (typeof callback !== 'function') {
      throw new TypeError('Signal.removeChangeCallback() : Second argument must be a Function')
    }

    if (typeof container.signals[query] !== 'undefined') {
      container.signals[query].remove(callback)
    }
  }

  initContainer (containerId, value) {
    this._containers[containerId] = value
    this._containers[containerId].signals = {}
  }

  destroyContainer (containerId) {
    if (typeof this._containers[containerId] !== 'undefined') {
      for (let signalProp in this._containers[containerId].signals) {
        this._containers[containerId].signals[signalProp].removeAll()
        this._containers[containerId].signals[signalProp] = null
      }

      this._containers[containerId] = null
      delete this._containers[containerId]
    }
  }

  _parseStateQuery (query) {
    const splittedQuery = query.split('.')

    return {
      container: this._containers[splittedQuery[0]],
      containerId: splittedQuery[0],
      prop: splittedQuery[1],
      splittedQuery
    }
  }
}

export default new State()
