const markdownIt = require("markdown-it")
const markdownItAttrs = require("markdown-it-attrs")
const markdownItDiv = require('markdown-it-div')
const markdownItAbbr = require('markdown-it-abbr')
const moment = require('moment')

require('dotenv').config();

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
            .use(markdownItAbbr)

  //11ty md eleventyConfig
  eleventyConfig.setLibrary("md", md)
  eleventyConfig.addPairedShortcode("markdown", function(content) {
    return md.render(content)
  })

  //passthough
  eleventyConfig.addPassthroughCopy("_source/assets")
  eleventyConfig.addPassthroughCopy("_source/images")

  //articles collection
  eleventyConfig.addCollection("articles", function(collection) {
    return articles = collection.getFilteredByGlob("./_source/articles/*.md").sort( function(a, b) {
      return b.date - a.date
    })
  })

  //tagList collection
  eleventyConfig.addCollection("tagList", require("./_lib/getTagList"))

  //diary collection
  eleventyConfig.addCollection("diary", function(collection) {
    return articles = collection.getFilteredByGlob(["./_source/photos/*.md", "./_source/notes/*.md"]).sort( function(a, b) {
      return b.date - a.date
    })
  })

  //shortcodes
  eleventyConfig.addShortcode("figure", require('./_lib/figure.js'))
  eleventyConfig.addShortcode("img", require('./_lib/img.js'))

  

  //filters
  eleventyConfig.addFilter("date", (value, format = 'D MMMM YYYY') => { //GDS format FTW
    return moment(value).format(format)
  })
  eleventyConfig.addFilter("urldate", (value, format = 'YYYY-MM-DD') => { //GDS format FTW
    return moment(value).format(format)
  })
  eleventyConfig.addFilter("firstParagraph", (html) => {
    var regexp = RegExp('\<p\>(.+?)\<\/p\>', 'm')
    return (regexp.exec(html) === null) ? '' : regexp.exec(html)[0]
  })
  eleventyConfig.addFilter("firstImage", (html) => {
    var regexp = RegExp('\<img src="(.+?)"', 'm')
    return (regexp.exec(html) === null) ? '' : regexp.exec(html)[1]
  })
  eleventyConfig.addFilter("plural", (noun, count, suffix="s") => {
    return `${noun}${count !== 1 ? suffix: ''}`
  })
  eleventyConfig.addFilter("stripTags", (html) => {
    return html.replace(/(<([^>]+)>)/ig,"")
  })
  eleventyConfig.addFilter("paginationURL", (index, prefix="page-") => {
    return (index === 0) ? `` : `${prefix}${index}/`
  })
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content)
  })
  eleventyConfig.addFilter("limit", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }
    return array.slice(0, n);
  })
  eleventyConfig.addFilter("hangingPunctuation", (str) => {
    return str.replace(/^(<p>)*([“"])(.*)/gm,"$1<span class='hanging-punctuation'>$2</span>$3")
  })

  //special filter that provides meta data for archives
  eleventyConfig.addFilter("archives", (posts) => {
    var archives = {
      years: [],
      posts: {},
      yearStats: {
        spread: 0,
        busiest: {
          year: 0,
          count: 0
        },
        quietest: {
          year: 0,
          count: 1000000
        },
      }
    }

    //set up temporary variables
    var year = null
    var postsForYear = {}

    //for each post
    posts.forEach((item, index) => {
      
      //variable per loop to hold current items year
      let itemYear = parseInt(moment(item.date).format('YYYY'))
 
      if(itemYear !== year) { //if this is a new year we haven't seen before
       
        //push the new year directly into the archive.years array
        archives.years.push(itemYear)

        //add a new item to the postForYear temporary object
        postsForYear[itemYear] = []

        //update the year variable for the next loop
        year = itemYear
      }

      //push the current posts item into the temporary object
      postsForYear[year].push(item)
    })

    //update the archives.posts array with the contents of the temporary object
    archives.posts = postsForYear

    //calculate year spread
    archives.yearStats.spread = Math.max( ...archives.years ) - Math.min( ...archives.years )

    //calculate busiest and quietest year
    archives.years.forEach( (year) => {
      
      if( archives.posts[year].length > archives.yearStats.busiest.count ) {
        archives.yearStats.busiest.count = archives.posts[year].length
        archives.yearStats.busiest.year = year
      }

      if( archives.posts[year].length < archives.yearStats.quietest.count ) {
        archives.yearStats.quietest.count = archives.posts[year].length
        archives.yearStats.quietest.year = year
      }
      
    })

    //return the full archives object
    return archives
  })

  eleventyConfig.addFilter("slugify", (str) => {
    return str.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
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