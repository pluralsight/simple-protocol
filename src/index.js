const isSuccess = p => p.success === true
const isFailure = p => p.success === false
const getSuccesses = l => l.filter(isSuccess)
const getFailures = l => l.filter(isFailure)

const isProtocol = (s) => {
  if (!s) return false
  if (hasSuccess(s) && (hasPayload(s) || hasError(s))) return true
  return false
}

const normalize = (fn, p) => isProtocol(p) ? p : fn(p)
const normalizeToSuccess = p => normalize(success, p)
const normalizeToFailure = p => normalize(failure, p)
const normalizeListToSuccess = (l) => l.map(normalizeToSuccess)
const normalizeListToFailure = (l) => l.map(normalizeToFailure)

const errorToObject = (e) => {
  const props = Object.getOwnPropertyNames(e).concat('name')
  return props.reduce((p, c) => {
    p[c] = e[c]
    return p
  }, {})
}

const success = (payload = null) => {
  return {
    success: true,
    payload
  }
}

const failure = (e = null) => {
  let error = e
  if (typeof e === 'string') {
    error = { message: e }
  } else if (e instanceof Error) {
    error = errorToObject(e)
  }

  return {
    success: false,
    error
  }
}

const hasError = (s) => s.hasOwnProperty('error')
const hasPayload = (s) => s.hasOwnProperty('payload')
const hasSuccess = (s) => s.hasOwnProperty('success')

module.exports = {
  getSuccesses,
  getFailures,
  normalizeToSuccess,
  normalizeToFailure,
  normalizeListToSuccess,
  normalizeListToFailure,
  isSuccess,
  isFailure,
  success,
  failure,
  isProtocol,
  errorToObject
}
