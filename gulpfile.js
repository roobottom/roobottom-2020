const { src, dest, watch, series } = require('gulp')
const less = require('gulp-less')
const cp = require('child_process')
const babel = require('gulp-babel')

const css = () => {
  return src('./_source/_less/styles.less')
    .pipe(less())
    .pipe(dest('./_site/assets'))
}

const eleventyLocal = (callback) => {
  return cp.spawn("npx", ["eleventy", '--serve'], { stdio: "inherit" })
  callback()
}
const eleventyLive = (callback) => {
  cp.spawn("npx", ["eleventy", ''], { stdio: "inherit" })
  callback()
}

const js = (callback) => {
  return src('./_source/app.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(dest('./_site'))
}

exports.default = function(callback) {
  eleventyLocal()
  watch(['./_source/_less/**/*.less'], 
    { ignoreInitial: false }, 
    series(css, js))
  callback()
}
exports.build = series(eleventyLive, css, js)