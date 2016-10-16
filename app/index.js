const emoji = require('./lib/emoji')
const Choice = require('./lib/choice')
const app = require('choo')()
const view = require('./view')
const MAX_RESULTS = 50

app.model({
  state: {
    emoji: emoji,
    query: '',
    results: [],
    selectedIndex: -1
  },
  reducers: {
    handleKeyup: (event, state) => {
      console.log('handleKeyup', event.key)
      switch (event.key) {
        case 'Escape':
          hideApp()
          return state
          break
        case 'ArrowDown':
          // disallow arrowing beyond the last result
          if (state.selectedIndex === state.results.length - 1) return state

          // increment selected index
          return Object.assign(state, {selectedIndex: ++state.selectedIndex})
          break
        case 'ArrowUp':
          // prevent ArrowUp key from moving cursor to start of input
          event.preventDefault()

          // bail if already on first result
          if (state.selectedIndex === -1) return state

          // decrement index
          return Object.assign(state, {selectedIndex: --state.selectedIndex})

          break
        case 'Enter':
          // If no results, do nothing
          if (!state.results.length) return state

          // Copy the state object, in case we need to make changes
          let newState = Object.assign({}, state)

          // If results exist but none are selected, "I'm feeling lucky"
          if (newState.selectedIndex === -1) newState.selectedIndex = 0

          // Write to clipboard and save to disk
          let choice = new Choice(newState.results[newState.selectedIndex], event)

          hideApp()
          return newState
          break
        case 'Shift':
        case 'Meta':
          // no-op
          return state
          break
        case '/':
          event.preventDefault()
          event.stopPropagation()

          // clear and focus the input. (inspired by vim, firefox, etc)
          return Object.assign(state, {
            selectedIndex: -1,
            query: ''
          })
          break
        default:
          // all other characters should be appended to query input
          // deselect
          return Object.assign(state, {selectedIndex: -1})
      }

    },
    updateQuery: (query, state) => {
      return Object.assign(state, {
        query: query,
        results: emoji.matching(query).slice(0, MAX_RESULTS),
        selectedIndex: -1
      })
    }
  }
})

app.router((route) => [route('/', view)])

const tree = app.start()
document.body.appendChild(tree)

function hideApp () {
  require('electron').remote.app.hide()
}
