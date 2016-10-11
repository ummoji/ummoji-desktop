const {app, BrowserWindow} = require('electron')
let win

app.on('ready', () => {
  let opts = {
    frame: false,
    transparent: true,
    width: 600
  }

  win = new BrowserWindow(opts)
  win.loadURL(`file://${__dirname}/index.html`)
})
