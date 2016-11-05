const emoji = require('ummoji-client')
const Choice = require('./lib/choice')
const MAX_RESULTS = 50

module.exports = {
  state: {
    emoji: emoji,
    query: '',
    results: [],
    selectedIndex: -1
  },

  subscriptions: {
    keys: (send, done) => {
      window.onkeydown = (event) => {
        send('handleKeydown', event, (err) => {
          if (err) return done(err)
        })
      },
      window.onkeyup = (event) => {
        send('handleKeyup', event, (err) => {
          if (err) return done(err)
        })
      }
    }
  },

  reducers: {
    handleKeyup: (event, state) => {
      console.log('handleKeyup', event.key)
      switch (event.key) {
        case '/':
          event.preventDefault()
          event.stopPropagation()
          console.log('slash up')
          // clear and focus the input. (inspired by vim, firefox, etc)
          return Object.assign(state, {
            selectedIndex: -1,
            query: ''
          })
          break
      }
    },

    handleKeydown: (event, state) => {
      console.log('handleKeydown', event.key)
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

        case 'Backspace':
          // Only delete the input content if the user just selected a result
          if (state.selectedIndex === -1) return state

          return Object.assign(state, {
            selectedIndex: -1,
            query: ''
          })

        case '/':
          console.log(event.target.name === 'query')

          // clear and focus the input. (inspired by vim, firefox, etc)
          return Object.assign(state, {
            selectedIndex: -1,
            query: ''
          })
          break

        case 'Shift':
        case 'Meta':
          // no-op
          return state
          break

        default:
          // new input; deselect any selected result
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
}

function hideApp () {
  require('electron').remote.app.hide()
}
