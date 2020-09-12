const attrs = require('./attrs.js')
const transforms = {
  default: 'tr:w-660',
  cover: 'tr:w-660,e-grayscale',
  wide: 'tr:w:1170'
}

module.exports = function(url, attrsObj, transform='default') {
  url = (url.charAt(0) === '/') ? url.substring(1) : url
  if(process.env.NODE_ENV === 'dev') {
    return `<img src="/${url}" ${attrs(attrsObj)}/>`
  }
  else {
    return `<img src="https://ik.imagekit.io/roobottom/${transforms[transform]}/${url}" ${attrs(attrsObj)}/>`
  }
}