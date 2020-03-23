const { src, dest, watch, series } = require('gulp')
const less = require('gulp-less')
const cp = require('child_process')
const babel = require('gulp-babel')
const sharp = require('sharp')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

const css = () => {
  return src(['./_source/_less/styles.less', './_source/_less/pdf-styles.less'])
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

const transforms = [
  {
    src: "./_source/images/**/*.+(jpeg|jpg|png)",
    dest: "./_site/assets/images/",
    options: {
      width: 860,
      fit: "cover"
    }
  }
]

const images = (callback) => {
  transforms.forEach( (transform) => {
    
    if(!fs.existsSync(transform.dest)) {
      fs.mkdirSync(transform.dest, {recursive: true}, (err) => {
        if (err) throw err
      })
    }

    let files = glob.sync(transform.src)

    files.forEach( (file) => {
      let filename = path.basename(file)
      console.log(path.dirname(file))
      // sharp(file)
      //   .resize(transform.options)
      //   .toFile(`${transform.dest}/${filename}`)
      //   .catch(err => {
      //     console.log(err)
      //   })
    })

  })
  callback()
}

exports.default = function(callback) {
  eleventyLocal()
  watch(['./_source/_less/**/*.less', './_source/app.js'], 
    { ignoreInitial: false }, 
    series(css, js))
  callback()
}
exports.build = series(eleventyLive, js, css)
exports.images = series(images)