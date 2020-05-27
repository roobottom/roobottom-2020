const { src, dest, watch, series } = require('gulp')
const less = require('gulp-less')
const cp = require('child_process')
const babel = require('gulp-babel')
const sharp = require('sharp')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

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
const transform_basepath = "./_source/article_images/"
const transforms = [
  {
    src: transform_basepath + "**/*.+(jpeg|jpg|png)",
    dest: "./_site/articles/",
    options: {
      width: 860,
      fit: "cover"
    },
    greyscale: false
  }
]

const images = (callback) => {
  transforms.forEach( (transform) => {
    

    let files = glob.sync(transform.src)

    files.forEach( (file) => {
      let filename = path.basename(file)
      let filepath = path.dirname(file)
      filepath = filepath.replace(transform_basepath, "")
      let destPath = `${transform.dest}/${filepath}`
      let destFile = `${destPath}/${filename}`

      if(!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, {recursive: true}, (err) => {
          if (err) throw err
        })
      }


      if(!fs.existsSync(destFile)) {
        sharp(file)
        .resize(transform.options)
        .greyscale(transform.greyscale)
        .toFile(destFile)
        .catch(err => {
          console.log(err)
        })
      }
      
    })

  })
  callback()
}

exports.default = function(callback) {
  eleventyLocal()
  watch(['./_source/_less/**/*.less', './_source/article_images/**/*.*'], 
    { ignoreInitial: false }, 
    series(css, images))
  callback()
}
exports.build = series(eleventyLive, css, images)
exports.images = series(images)