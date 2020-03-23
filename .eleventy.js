const markdownIt = require("markdown-it")
const markdownItAttrs = require("markdown-it-attrs")
const markdownItDiv = require("markdown-it-div")


module.exports = function (eleventyConfig) {

  //markdown-it eleventyConfig
  let mdOptions = {
    typographer: true,
    quotes: '“”‘’',
    html: true
  }
  let md =  markdownIt(mdOptions)
            .use(markdownItAttrs)
            .use(markdownItDiv)

  //11ty md eleventyConfig
  eleventyConfig.setLibrary("md", md)
  eleventyConfig.addPairedShortcode("markdown", function(content) {
    return md.render(content)
  })

  //passthough
  eleventyConfig.addPassthroughCopy("_source/assets")

  //create articles category
  eleventyConfig.addCollection("articles", function(collection) {
    return collection.getFilteredByGlob("./_source/articles/*.md")
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