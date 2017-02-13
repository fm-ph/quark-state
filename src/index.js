import Signal from 'quark-signal'

import isEqual from 'lodash.isequal'
import omit from 'lodash.omit'
import cloneDeep from 'lodash.clonedeep'

/**
 * State class
 *
 * @class
 *
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 *
 * @author Patrick Heng <hengpatrick.pro@gmail.com>
 * @author Fabien Motte <contact@fabienmotte.com>
 */
class State {
  /**
   * Creates an instance of State
   *
   * @constructor
   */
  constructor () {
    /**
     * @type object
     * @private
     */
    this._containers = []
  }

  /**
   * Get a value
   *
   * @param {string} query Query string
   *
   * @returns {any} Value
   *
   * @throws {Error} Cannot get a value from a container that does not exist
   */
  get (query) {
    const { container, splittedQuery } = this._parseStateQuery(query)

    if (typeof container === 'undefined') {
      throw new Error('State.get() : Cannot get a value from a container that does not exist')
    }

    let value = container

    if (splittedQuery.length > 1) {
      for (let i = 1, l = splittedQuery.length; i < l; i++) {
        value = value[splittedQuery[i]]

        if (typeof value === 'undefined' || value === null) {
          // @todo throw an error if the value does not exist ?
          break
        }
      }
    }

    // If it is a container, omit 'signals' property
    if (splittedQuery.length === 1) {
      return omit(value, 'signals')
    }

    return value
  }

  /**
   * Set a value
   *
   * @param {string} query Query string
   * @param {any} value Value to set
   * @param {boolean} [forced=false] Flag to overwrite an object
   *
   * @throws {Error} Cannot set a value on a container that does not exist
   */
  set (query, value, forced = false) {
    const { container, containerId, splittedQuery } = this._parseStateQuery(query)

    if (typeof container === 'undefined') {
      throw new Error('State.set() : Cannot set a value on a container that does not exist')
    }

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
            ...oldVal,
            ...value
          }
        }
      }

      target = target[p]

      let signalId = containerId
      for (let j = 1; j <= i; j++) {
        signalId += `_${splittedQuery[j]}`
      }

      if (typeof container.signals[signalId] !== 'undefined') {
        if (!isEqual(oldVal, target)) {
          container.signals[signalId].dispatch(oldVal, target)
        }
      }
    }
  }

  /**
   * Has a value
   *
   * @param {string} query Query string
   *
   * @returns {boolean} True if a value is found, false otherwise
   */
  has (query) {
    const { container } = this._parseStateQuery(query)

    if (typeof container === 'undefined') {
      return false
    }

    const value = this.get(query)

    return (typeof value !== 'undefined' && value !== null)
  }

  /**
   * Clear all containers
   */
  clear () {
    for (let containerId in this._containers) {
      this.destroyContainer(containerId)
    }

    this._containers = {}
  }

  /**
   * Add a callback on value change
   *
   * @param {string} query Query string
   * @param {function} callback Callback
   *
   * @throws {TypeError} Second argument must be a Function
   */
  onChange (query, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('State.onChange() : Second argument must be a Function')
    }

    const { container, containerId, splittedQuery } = this._parseStateQuery(query)

    let signalId = containerId

    for (let i = 1, l = splittedQuery.length; i < l; i++) {
      signalId += `_${splittedQuery[i]}`
    }

    if (typeof container.signals[query] === 'undefined') {
      container.signals[signalId] = new Signal()
    }

    container.signals[signalId].add(callback)
  }

  /**
   * Remove callback on Change
   *
   * @param {string} query Query string
   * @param {function} callback Callback
   *
   * @throws {TypeError} Second argument must be a Function
   */
  removeChangeCallback (query, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('State.removeChangeCallback() : Second argument must be a Function')
    }

    const { container } = this._parseStateQuery(query)

    if (typeof container.signals[query] !== 'undefined') {
      container.signals[query].remove(callback)
    }
  }

  /**
   * Initialize a container
   *
   * @param {string} containerId Container id
   * @param {object} value Object to initialize the container
   */
  initContainer (containerId, value) {
    this._containers[containerId] = cloneDeep(value)
    this._containers[containerId].signals = {}
  }

  /**
   * Destroy a container
   *
   * @param {string} containerId Container id
   *
   * @throws {Error} Cannot destroy a container that does not exist
   */
  destroyContainer (containerId) {
    if (typeof this._containers[containerId] === 'undefined') {
      throw new Error('State.destroyContainer() : Cannot destroy a container that does not exist')
    }

    for (let signalProp in this._containers[containerId].signals) {
      this._containers[containerId].signals[signalProp].removeAll()
      this._containers[containerId].signals[signalProp] = null
    }

    this._containers[containerId] = null
    delete this._containers[containerId]
  }

  /**
   * Parse state query
   *
   * @private
   *
   * @param {string} query Query string
   *
   * @property {object} container Container
   * @property {string} containerId Container id
   * @property {prop} container Container
   * @property {array} splittedQuery SplittedQuery
   */
  _parseStateQuery (query) {
    const splittedQuery = query.split('.')

    return {
      container: this._containers[splittedQuery[0]],
      containerId: splittedQuery[0],
      splittedQuery
    }
  }
}

export default new State()
