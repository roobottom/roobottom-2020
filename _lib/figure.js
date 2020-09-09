const img = require('./img.js')
const attrs = require('./attrs.js')

module.exports = function(url, caption, classnames) {
  return `
<figure ${attrs({'class':classnames})}>
  ${img(url)}
  ${figcaption(caption)}
</figure>
  `
}

const figcaption = (caption) => {
  if(caption === undefined) return ''
  else return `<figcaption>${caption}</figcaption>`
}