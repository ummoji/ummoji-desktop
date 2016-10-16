const emojiData = require('emoji-data')
const emojiRankings = require('emoji-rankings')
const emojilib = require('emojilib').lib

const data = emojiData
  .all()
  .map(e => {
    var out = {
      name: e.name,
      shortName: e.short_name,
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

process.stdout.write(JSON.stringify(data, null, 2))
