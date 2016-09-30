const yo = require('yo-yo')
const emoji = require('./lib/emoji')
var $results = yo`<ul></ul>`
document.querySelector('results').appendChild($results)
document.querySelector('input[name="query"]').addEventListener('input', search)

function list (items) {
  return yo`<ul>
    ${items.map(function (item) {
      const {name, short_name, unified, char, rank, keywords} = item
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
        </li>`
    })}
  </ul>`
}

function search(event) {
  var query = event.target.value
  yo.update($results, list(emoji.matching(query).slice(0, 10)))
}
