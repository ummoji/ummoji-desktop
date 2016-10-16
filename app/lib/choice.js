const {clipboard} = require('electron')
const Config = require('electron-config')
window.config = window.config || new Config()

module.exports = class Choice {
  constructor (data, event) {
    Object.assign(this, data)

    if (event) this.query = event.target.value

    // Keep a record of whether user chose the emoji itself 🍐 or its short form :pear:
    if (['Alt', 'Control', 'Meta', 'Shift'].some(key => event.getModifierState(key))) {
      this.desiredProp = 'shortName'
      clipboard.writeText(`:${this.shortName}:`)
    } else {
      this.desiredProp = 'char'
      clipboard.writeText(this.char)
    }

    // Persist the choice to disk!
    config.set('choices', (config.get('choices') || []).concat(this))
  }
}
