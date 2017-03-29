require('electron-analytics').init('S1guTYsxsl')

const {app, BrowserWindow} = require('electron')
let win

app.on('ready', () => {
  require('./lib/menu')

  let opts = {
    frame: false,
    transparent: true,
    width: 600
  }

  win = new BrowserWindow(opts)
  win.loadURL(`file://${__dirname}/index.html`)
})
