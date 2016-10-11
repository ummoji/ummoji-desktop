NodeList.prototype.forEach = Array.prototype.forEach
const {clipboard} = require('electron')
const yo = require('yo-yo')
const emoji = require('./lib/emoji')
const Config = require('electron-config')
window.config = new Config()

// Create elements
var $results = render()
var $input = yo`
  <header>
    <input
      oninput=${search}
      type="text"
      name="query"
      placeholder="Find emoji..."
      autofocus
      tabindex=1>
  </header>`

// Add elements to DOM
document.body.appendChild($input)
document.body.appendChild($results)

function search(event) {
  const query = (event && event.target) ? event.target.value : ''
  const results = emoji.matching(query).slice(0, 50)
  yo.update($results, render(results))
}

function render (results) {
  results = results || []
  return yo`
    <ul class="results">${results.map(result => {
      const {name, short_name, unified, char, rank, keywords} = result
      return yo`
        <li
          class="result"
          id="${unified}"
          data-unified="${unified}"
          data-rank="${rank}"
          data-name="${name}"
          data-short-name="${short_name}"
          data-char="${char}"
          data-keywords=${keywords.join(', ')}
        >
        <div class="result-char">${char}</div>
        <div class="result-details">
          <span class="result-short-name">${short_name}</span>
          <span class="result-keywords">${keywords.join(', ')}</span>
        </div>
        </li>`
    })}
    </ul>`
}

// React to keyboard input (after DOM is ready)
const input = document.querySelector('input[name="query"]')
let results = document.querySelectorAll('.results > li')
let selectedIndex = -1

document.addEventListener('keydown', event => {
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
      bingo(event)
      break
    case 'Shift':
    case 'Meta':
      // no-op
      break
    case '/':
      // inspired by vim, firefox, etc
      clearAndFocusInput(event)
      break
    default:
      // all other characters should be appended to query input
      focusInputAndDeselectResults()
  }
})

function hideApp () {
  require('electron').remote.app.hide()
}

function clearAndFocusInput (event) {
  event.preventDefault()
  input.value = ''
  input.oninput()
  focusInputAndDeselectResults()
}

function focusInputAndDeselectResults () {
  selectedIndex = -1
  results.forEach((result, i) => result.classList.remove('selected'))
  input.focus()
}

function prev (event) {
  // prevent ArrowUp key from moving cursor to start of input
  event.preventDefault()

  // bail if already on first result
  if (selectedIndex < 0) return
  selectedIndex--
  selectCurrentResult()
}

function next () {
  // update result set (so we can get a count)
  results = document.querySelectorAll('.results > li')

  // bail if already on last result
  if (selectedIndex === results.length - 1) return
  selectedIndex++
  selectCurrentResult()
}

function selectCurrentResult () {
  results.forEach((result, i) => {
    result.classList.toggle('selected', i === selectedIndex)
  })
}

function bingo (event) {
  // try to select first result
  if (selectedIndex < 0 && results.length) selectedIndex = 0

  // bail if no result
  if (selectedIndex < 0) return

  // pluck properties from data attributes
  let {char, shortName, unified} = results[selectedIndex].dataset

  // copy 🍐 to clipboard, or :pear: if a modifier key is pressed
  if (['Alt', 'Control', 'Meta', 'Shift'].some(key => event.getModifierState(key))) {
    clipboard.writeText(`:${shortName}:`)
  } else {
    clipboard.writeText(char)
  }

  // save query history
  let queries = config.get('queries') || []
  queries.push({
    query: input.value,
    unified: unified,
    shortName: shortName,
    date: new Date()
  })
  config.set('queries', queries)

  hideApp()
}
