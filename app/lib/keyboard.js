const {clipboard} = require('electron')
const $input = document.querySelector('input[name="query"]')
let results = document.querySelectorAll('.results > li')
let highlightIndex = -1

document.addEventListener('keydown', event => {
  console.log(event.key)
  switch (event.key) {
    case 'Escape':
      hideApp()
      break
    case 'ArrowDown':
      next()
      break
    case 'ArrowUp':
      prev(event)
      break
    case 'Enter':
      selectCurrentResult(event)
      break
    case 'Shift':
    case 'Meta':
      // no-op
      break
    case '/':
      // inspired by vim, firefox, etc
      clearAndFocusInput()
      break
    default:
      // all other characters should be appended to query input
      focusInput()
  }
})

function hideApp () {
  require('electron').remote.app.hide()
}

function clearAndFocusInput () {
  event.preventDefault()
  $input.value = ''
  focusInput()
}

function focusInput () {
  console.log('focus input')
  highlightIndex = -1
  results.forEach((result, i) => {
    result.classList.remove('selected')
  })
  $input.focus()
}

function prev (event) {
  // prevent ArrowUp key from moving cursor to start of input
  event.preventDefault()
  results = document.querySelectorAll('.results > li')
  // bail if already on first result
  if (highlightIndex < 0) return
  highlightIndex--
  highlightCurrentResult()
}

function next () {
  results = document.querySelectorAll('.results > li')
  // bail if already on last result
  if (highlightIndex === results.length - 1) return
  highlightIndex++
  highlightCurrentResult()
}

function highlightCurrentResult () {
  results.forEach((result, i) => {
    result.classList.toggle('selected', i === highlightIndex)
  })
}

function selectCurrentResult (event) {
  let {shortName, char} = results[highlightIndex].dataset
  if (['Alt', 'Control', 'Meta', 'Shift'].some(key => event.getModifierState(key))) {
    clipboard.writeText(`:${shortName}:`)
  } else {
    clipboard.writeText(char)
  }
  hideApp()
}
