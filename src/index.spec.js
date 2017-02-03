const { deepEqual } = require('assert')
const {
  isSuccess,
  isFailure,
  getSuccesses,
  getFailures,
  normalizeToSuccess,
  normalizeToFailure,
  normalizeListToSuccess,
  normalizeListToFailure,
  success,
  failure,
  isProtocol,
  clean
} = require('./index')

describe('index.js', () => {
  describe('success()', () => {
    it('should return a success', () => {
      const actual = success(32)
      const expected = {
        success: true,
        payload: 32
      }
      deepEqual(actual, expected)
    })
  })

  describe('failure()', () => {
    it('should return a failure', () => {
      let error = {
        message: 'oops'
      }
      const actual = failure(error)
      const expected = {
        success: false,
        error
      }
      deepEqual(actual, expected)
    })

    it('should handle string failure messages', () => {
      const actual = failure('oops')
      const expected = {
        success: false,
        error: {
          message: 'oops'
        }
      }
      deepEqual(actual, expected)
    })

    it('should convert errors to objects', () => {
      const error = new Error('oops')
      error.someprop = 32
      const actual = failure(error)
      const expected = {
        success: false,
        error: {
          message: 'oops',
          name: 'Error',
          stack: error.stack,
          someprop: 32
        }
      }
      deepEqual(actual, expected)
    })
  })

  describe('isSuccess()', () => {
    it('should return true if is a success', () => {
      const s = success()
      const actual = isSuccess(s)
      const expected = true
      deepEqual(actual, expected)
    })

    it('should return false if not a success', () => {
      const s = failure()
      const actual = isSuccess(s)
      const expected = false
      deepEqual(actual, expected)
    })
  })

  describe('isFailure()', () => {
    it('should return true if is a failure', () => {
      const s = failure()
      const actual = isFailure(s)
      const expected = true
      deepEqual(actual, expected)
    })

    it('should return false if not a failure', () => {
      const s = success()
      const actual = isFailure(s)
      const expected = false
      deepEqual(actual, expected)
    })
  })

  describe('isProtocol()', () => {
    it('should return true if is protocol object', () => {
      const a = success()
      deepEqual(isProtocol(a), true)
      const b = failure()
      deepEqual(isProtocol(b), true)
      const c = {
        success: true,
        payload: null,
        meta: {}
      }
      deepEqual(isProtocol(c), true)
    })

    it('should return false if is not protocol object', () => {
      const a = null
      deepEqual(isProtocol(a), false)
      const b = {}
      deepEqual(isProtocol(b), false)
      const c = { success: true }
      deepEqual(isProtocol(c), false)
    })
  })

  describe('getSuccesses()', () => {
    it('should return successes from list', () => {
      const l = [success(), failure(), success(), failure()]
      const actual = getSuccesses(l)
      const expected = [success(), success()]
      deepEqual(actual, expected)
    })
  })

  describe('getFailures()', () => {
    it('should return failures from list', () => {
      const l = [success(), failure(), success(), failure()]
      const actual = getFailures(l)
      const expected = [failure(), failure()]
      deepEqual(actual, expected)
    })
  })

  describe('normalizeToSuccess()', () => {
    it('should return a success', () => {
      const actual = normalizeToSuccess(1)
      const expected = success(1)
      deepEqual(actual, expected)
    })

    it('should not double wrap a success', () => {
      const a = success(1)
      const actual = normalizeToSuccess(a)
      const expected = success(1)
      deepEqual(actual, expected)
    })

    it('should not double wrap a failure', () => {
      const a = failure(1)
      const actual = normalizeToSuccess(a)
      const expected = failure(1)
      deepEqual(actual, expected)
    })
  })

  describe('normalizeToFailure()', () => {
    it('should return a failure', () => {
      const actual = normalizeToFailure(1)
      const expected = failure(1)
      deepEqual(actual, expected)
    })

    it('should not double wrap a failure', () => {
      const a = failure(1)
      const actual = normalizeToFailure(a)
      const expected = failure(1)
      deepEqual(actual, expected)
    })

    it('should not double wrap a success', () => {
      const a = success(1)
      const actual = normalizeToFailure(a)
      const expected = success(1)
      deepEqual(actual, expected)
    })
  })

  describe('normalizeListToSuccess()', () => {
    it('should return a list of successes', () => {
      const l = [1, 2, 3]
      const actual = normalizeListToSuccess(l)
      const expected = [success(1), success(2), success(3)]
      deepEqual(actual, expected)
    })

    it('should not double wrap a success', () => {
      const l = [1, success(2), 3]
      const actual = normalizeListToSuccess(l)
      const expected = [success(1), success(2), success(3)]
      deepEqual(actual, expected)
    })

    it('should not double wrap a failure', () => {
      const l = [1, success(2), failure(3)]
      const actual = normalizeListToSuccess(l)
      const expected = [success(1), success(2), failure(3)]
      deepEqual(actual, expected)
    })
  })

  describe('normalizeListToFailures()', () => {
    it('should return a list of failures', () => {
      const l = [1, 2, 3]
      const actual = normalizeListToFailure(l)
      const expected = [failure(1), failure(2), failure(3)]
      deepEqual(actual, expected)
    })

    it('should not double wrap a failure', () => {
      const l = [1, failure(2), 3]
      const actual = normalizeListToFailure(l)
      const expected = [failure(1), failure(2), failure(3)]
      deepEqual(actual, expected)
    })

    it('should not double wrap a failure', () => {
      const l = [1, success(2), failure(3)]
      const actual = normalizeListToFailure(l)
      const expected = [failure(1), success(2), failure(3)]
      deepEqual(actual, expected)
    })
  })

  describe('clean()', () => {
    it('should clean a success', () => {
      const s = success(1)
      s.meta = { foo: 'bar' }
      const actual = clean(s)
      const expected = {
        success: true,
        payload: 1
      }
      deepEqual(actual, expected)
    })

    it('should clean a failure', () => {
      const s = failure(1)
      s.meta = { foo: 'bar' }
      const actual = clean(s)
      const expected = {
        success: false,
        error: 1
      }
      deepEqual(actual, expected)
    })
  })
})
