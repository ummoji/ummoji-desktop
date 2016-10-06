const emojiData = require('emoji-data')
const emojiRankings = require('emoji-rankings')
const emojilib = require('emojilib').lib

var emoji = {}

emoji.entries = emojiData
  .all()
  .map(e => {
    var out = {
      name: e.name,
      short_name: e.short_name,
      unified: e.unified,
      char: e.render(),
      rank: emojiRankings.find(ranked => ranked.id === e.unified).score,
      keywords: []
    }

    // Add keywords (synonyms), if defined
    var lib = emojilib[e.short_name]
    if (lib) {
      out.keywords = lib.keywords || []
    }

    return out
  })
  .sort((a, b) => b.rank - a.rank)

emoji.matching = (query) => {
  if (!query || !query.length) return []

  // make query pattern case insensitive
  query = new RegExp(query, 'i')

  return emoji.entries.filter(e => {
    return e.short_name.match(query) ||
    String(e.id).match(query) ||
    e.name.match(query) ||
    e.keywords.some(keyword => keyword.match(query))
  })
}

module.exports = emoji
