require('electron-analytics').init('S1guTYsxsl')
const {app} = require('electron')

require('update-electron-app')({
  logger: require('electron-log')
})

function initialize () {
  app.on('ready', () => {
    require('./app/lib/menu')()
    require('./app/lib/window')()
  })
}

initialize()