const html = require('choo/html')

module.exports = function (state, prev, send) {
  return html`
    <content>
      <header>
        <input
          type="text"
          name="query"
          placeholder="Find emoji..."
          autofocus
          tabindex=1
          value="${state.query}"
          oninput=${(e) => send('updateQuery', e.target.value)}
        >
      </header>

      <ul class="results">${state.results.map((result, index) => {
        const {name, shortName, unified, char, rank, keywords} = result
        return html`
          <li class="result ${index === state.selectedIndex ? 'selected' : ''}">
          <div class="result-char">${char}</div>
          <div class="result-details">
            <span class="result-short-name">${shortName}</span>
            <span class="result-keywords">${keywords.join(', ')}</span>
          </div>
          </li>`
      })}
      </ul>
    </content>
  `
}
