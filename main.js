require('electron-analytics').init('S1guTYsxsl')
const {app} = require('electron')
const updater = require('./app/lib/updater')

function initialize () {
  app.on('ready', () => {
    require('./app/lib/menu')()
    require('./app/lib/window')()
    updater.initialize()
  })
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    updater.createShortcut(function () { app.quit() })
    break
  case '--squirrel-uninstall':
    updater.removeShortcut(function () { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}
