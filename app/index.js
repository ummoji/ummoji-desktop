NodeList.prototype.forEach = Array.prototype.forEach

const yo = require('yo-yo')
const emoji = require('./lib/emoji')

var $input = yo`
  <input
    oninput=${search}
    type="text"
    name="query"
    placeholder="Find emoji..."
    autofocus
    tabindex=1>`

var $results = renderResults()

document.body.appendChild($input)
document.body.appendChild($results)

require('./lib/keyboard')

function search(event) {
  var query = event.target.value
  yo.update($results, renderResults(emoji.matching(query).slice(0, 50)))
}

function renderResult (emoji) {
  const {name, short_name, unified, char, rank, keywords} = emoji
  return yo`
    <li
      class="result"
      id="${unified}"
      data-rank="${rank}"
      data-name="${name}"
      data-short-name="${short_name}"
      data-char="${char}"
      data-keywords=${keywords.join(', ')}
    >
    <div class="result-char">${char}</div>
    <div class="result-details">
      <span class="result-short-name">${short_name}</span>
      <span class="result-keywords">${keywords.join(', ')}</span>
    </div>
    </li>
  `
}

function renderResults (results) {
  results = results || []
  return yo`<ul class="results">${results.map(renderResult)}</ul>`
}
