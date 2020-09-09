const attrs = require('./attrs.js')
const urls = {
  local: {
    tld: 'https://roobottom.com',
  }, 
  cloudinary: {
    url: 'https://res.cloudinary.com/roobottom/image/fetch/',
    format: 'w_660'
  }
}

module.exports = function(url, attrsObj) {
  if(process.env.NODE_ENV === 'dev') {
    return `<img src="${url}" ${attrs(attrsObj)}/>`
  }
  else {
    return `<img src="${urls.cloudinary.url}${urls.cloudinary.format}/${urls.local.tld}${url}" ${attrs(attrsObj)}/>`
  }
}