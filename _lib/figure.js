module.exports = function(url, caption, classnames) {
  return `
<figure ${style(classnames)}>
  <img src="${url}"/>
  ${figcaption(caption)}
</figure>
  `
}

const figcaption = (caption) => {
  if(caption === undefined) return ''
  else return `<figcaption>${caption}</figcaption>`
}

const style = (classnames) => {
  if(classnames === undefined) return ''
  else return `class="${classnames}"`
}