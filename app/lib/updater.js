const {autoUpdater, dialog} = require('electron')
const server = 'https://ummoji-updates-mfidgbdrmc.now.sh'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`
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