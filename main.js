require('electron-analytics').init('S1guTYsxsl')
const {app} = require('electron')
const updater = require('./app/lib/updater')

function initialize () {
  app.on('ready', () => {
    require('./app/lib/menu')()
    require('./app/lib/window')()
    updater()
  })
}

initialize()