const markdownIt = require("markdown-it")
const markdownItAttrs = require("markdown-it-attrs")
const markdownItImplicitFigures = require('markdown-it-implicit-figures')
const markdownItDiv = require('markdown-it-div')
const markdownItAbbr = require('markdown-it-abbr')
const moment = require('moment')


module.exports = function (eleventyConfig) {

  //markdown-it eleventyConfig
  let mdOptions = {
    typographer: true,
    quotes: '“”‘’',
    html: true
  }
  let md =  markdownIt(mdOptions)
            .use(markdownItAttrs)
            .use(markdownItImplicitFigures, {
              dataType: true,
              figcaption: true,
              copyAttrs: true
            })
            .use(markdownItDiv)
            .use(markdownItAbbr)

  //11ty md eleventyConfig
  eleventyConfig.setLibrary("md", md)
  eleventyConfig.addPairedShortcode("markdown", function(content) {
    return md.render(content)
  })

  //passthough
  eleventyConfig.addPassthroughCopy("_source/assets")

  //create articles category
  eleventyConfig.addCollection("articles", function(collection) {
    return articles = collection.getFilteredByGlob("./_source/articles/*.md").sort( function(a, b) {
      return b.date - a.date
    })
  })

  //filters
  eleventyConfig.addFilter("date", (value, format = 'dddd, Do MMMM YYYY') => {
    return moment(value).format(format)
  })


  return {
    dir: {
      input: "_source",
      includes: "_includes",
      layouts: "_layouts",
      dataTemplateEngine: "njk",
      markdownTemplateEngine: "njk",
      htmlTemplateEngine: "njk",
      templateFormats: ["html", "njk"]
    }
  }
  
}