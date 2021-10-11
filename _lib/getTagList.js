// Based on: https://github.com/11ty/eleventy-base-blog

const _ = require('lodash')

module.exports = function(collection) {
  let tagArray = new Array()
  collection.getAll().forEach(function(item) {
    if("tags" in item.data) {
      let tags = item.data.tags;

      tags = tags.filter(function(item) {
        switch(item) {
          // this list should match the `filter` list in tags.njk
          case "all":
          case "articles":
            return false;
        }
        return true;
      })

      for (const tag of tags) {
        tagArray.push(_.lowerCase(tag))
      }
      
    }
  })
  
  // returning an array in addCollection works in Eleventy 0.5.3
  return sortByFrequency([...tagArray])
}

function sortByFrequency(array) {
  var frequency = {};

  array.forEach(function(value) { frequency[value] = 0; });

  var uniques = array.filter(function(value) {
    return ++frequency[value] == 1;
  });

  return uniques.sort(function(a, b) {
    return frequency[b] - frequency[a];
  });
}