const {BrowserWindow} = require('electron')

module.exports = function createWindow () {
  const opts = {
    frame: false,
    transparent: true,
    width: 600
  }
  win = new BrowserWindow(opts)
  win.loadURL(`file://${__dirname}/index.html`)
}
