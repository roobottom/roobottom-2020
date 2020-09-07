module.exports = (obj) => {
  let str = ''
  for (const key in obj) {
    str += ` ${key}="${obj[key]}"`
  }
  return str
}