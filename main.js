require('electron-analytics').init('S1guTYsxsl')
const {app} = require('electron')

require('./app/lib/updater')({
  repo: 'ummoji/ummoji-desktop'
})

function initialize () {
  app.on('ready', () => {
    require('./app/lib/menu')()
    require('./app/lib/window')()
  })
}

initialize()