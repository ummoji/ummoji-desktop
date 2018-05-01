const {app} = require('electron')

require('update-electron-app')()

function initialize () {
  app.on('ready', () => {
    require('./app/lib/menu')()
    require('./app/lib/window')()
  })
}

initialize()