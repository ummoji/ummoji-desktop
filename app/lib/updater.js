const {app, autoUpdater, dialog} = require('electron')
const server = 'https://electron-update-server.herokuapp.com'
const owner = 'ummoji'
const repo = 'ummoji-desktop'
const feed = `${server}/${owner}/${repo}/${process.platform}/${app.getVersion()}`
console.log(feed)
const updateInterval = 60 * 1000

module.exports = function initUpdater () {
  autoUpdater.setFeedURL(feed)
  
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, updateInterval)
  
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
  })
}