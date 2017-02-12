/**
 * Simple class
 *
 * @class
 *
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 *
 * @author Patrick Heng <hengpatrick.pro@gmail.com>
 * @author Fabien Motte <contact@fabienmotte.com>
 *
 * @example
 * const simple = new Simple()
 * simple.test()
 */
class Simple {
  /**
   * Creates an instance of Simple
   *
   * @constructor
   */
  constructor () {
    this.message = 'Hello world'
  }

  /**
   * Simple method
   *
   * @returns {string}
   */
  test () {
    return this.message
  }
}

export default Simple
