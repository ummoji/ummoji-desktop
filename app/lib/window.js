const {BrowserWindow} = require('electron')
const path = require('path')
let win

module.exports = function createWindow () {
  const opts = {
    frame: false,
    transparent: true,
    width: 600
  }
  win = new BrowserWindow(opts)
  win.loadURL(`file://${path.join(__dirname, '..', 'index.html')}`)
}
