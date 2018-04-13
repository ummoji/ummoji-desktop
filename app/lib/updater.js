/* Usage:

require('whatever-we-call-this-updater-thing')({
  repo: 'ummoji/ummoji-desktop'
})

Options:

- `repo` String (required) - A GitHub repository in the format `owner/repo`
- `host` String (optional) - Defaults to `https://electron-update-server.herokuapp.com`
- `updateInterval` Integer (optional) - How frequently to check for updates in milliseconds. Defaults to `60000` (one minute)
- `debug` Boolean (optional) - Display debug output. Defaults to `false`

*/

const assert = require('assert')
const isURL = require('is-url')
const {app, autoUpdater, dialog} = require('electron')

module.exports = function updater(opts = {}) {
  if (app.isReady()) {
    initUpdater(opts)
  } else {
    app.on('ready', () => initUpdater(opts))
  }
}

module.exports = function initUpdater (opts) {
  const defaults = {
    host: 'https://electron-update-server.herokuapp.com',
    updateInterval: 60 * 1000,
    debug: false
  }
  const {host, repo, updateInterval, debug} = Object.assign({}, defaults, opts)

  assert(repo && repo.length && repo.includes('/'), 'repo is required and should be in the format `owner/repo`')
  assert(isURL(host) && host.startsWith('https'), 'host must be a valid HTTPS URL')
  assert(Number(updateInterval) > 30*1000, 'updateInterval must be a number greater than 30000 (30 seconds)')

  const feedURL = `${host}/${repo}/${process.platform}/${app.getVersion()}`

  if (debug) console.debug('feedURL', feedURL)

  autoUpdater.setFeedURL(feedURL)
  
  setInterval(() => { autoUpdater.checkForUpdates() }, updateInterval)
  
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    if (debug) {
      console.debug('update-downloaded')
      console.debug('event', event)
      console.debug('releaseNotes', releaseNotes)
      console.debug('releaseName', releaseName)
    } 

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