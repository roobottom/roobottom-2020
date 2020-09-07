const attrs = require('./attrs.js')

module.exports = function(url, attrsObj) {
  return `<img src="${url}" ${attrs(attrsObj)}/>`
}