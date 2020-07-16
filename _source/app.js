;(function() {

  //colour modes. 
  //based on https://github.com/Dorson/CSS-Dark-Mode-and-color-switch

  const localStorageId = 'colourMode'

  //change colour modes and manage memory
  function changeColorMode( tagName, className, memoryName ) {
    const classWasActive = document.querySelector(tagName).classList.contains(className)
    const oldMemory = window.localStorage.getItem(memoryName)

    console.log(classWasActive, oldMemory)

    //if, class is not active and class is not stored in memory:
    if(!classWasActive && (oldMemory !== className)) {

      if(oldMemory) {
        document.querySelector(tagName).classList.remove(oldMemory)
        window.localStorage.removeItem(memoryName)
      }

      document.querySelector(tagName).classList.add(className)
      window.localStorage.setItem(memoryName , className)


    }

    //else, class is active
    else {
      document.querySelector(tagName).classList.toggle(className)
      
      if (oldMemory) {
        document.querySelector(tagName).classList.remove(oldMemory)
        window.localStorage.removeItem(memoryName)
     }

    }

    return false

  }


  //load colourClasses from memory
  function recallColourClasses(tag, memoryName) {
    let tagNotAlive = !(document.querySelector(tag))
    let memoryValue = window.localStorage.getItem(memoryName)

    if(!memoryValue || tagNotAlive) {
      return false
    }
    else {
      document.querySelector(tag).classList.add(memoryValue)
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    console.log('loaded')
    recallColourClasses('html', localStorageId)
  })



  //toggle between two colour modes
  function toggelColourModes(tagName, class1, class2, memoryName) {
    const classWasActive = document.querySelector(tagName).classList.contains(class1)
    if(!classWasActive) { changeColorMode(tagName, class1, memoryName) }
    else { changeColorMode(tagName, class2, localStorageId)}
    return false
  }


  //event listener for button
  document.querySelector('[data-toggle="colourmodes"]').addEventListener('click', () => {
    toggelColourModes('html', 'lightmode', 'darkmode', 'colourMode')
  })


  
  
})()

