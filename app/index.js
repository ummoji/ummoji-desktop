const yo = require('yo-yo')
const emoji = require('./lib/emoji')

var $input = yo`
  <input
    oninput=${search}
    type="text"
    name="query"
    placeholder="Find emoji..."
    autofocus
    tabindex=1
  >
`
var $results = yo`<ul></ul>`

document.body.appendChild($input)
document.body.appendChild($results)

function renderMatch (emoji) {
  const {name, short_name, unified, char, rank, keywords} = emoji
  return yo`
    <li
      class="result"
      id="${unified}"
      data-rank="${rank}"
      data-name="${name}"
      data-short-name="${short_name}"
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

function list (matches) {
  return yo`<ul>${matches.map(renderMatch)}</ul>`
}

function search(event) {
  var query = event.target.value
  yo.update($results, list(emoji.matching(query).slice(0, 50)))
}
