class Poll {
  constructor(root, title){
    this.root = root
    this.selected = sessionStorage.getItem("poll-selected")
    this.serverURL = 'http://localhost:5000/poll'
    this.root.insertAdjacentHTML('afterbegin', `
      <div class="poll-title">${ title }</div>
    `)

    this._refresh()
  }

  async _refresh() {
    const res = await fetch(this.serverURL)
    const data = await res.json()

    this.root.querySelectorAll('.poll-option').forEach(op => {
      op.remove()
    })

    for (const option of data){
      const voteForm = document.createElement("div")
      
      voteForm.innerHTML = `
        <div class="poll-option ${ this.selected == option.label ? "selected": "" }">
          <div class="poll-option-fill"></div>
          <div class="poll-option-info">
            <span class="poll-label">${ option.label }</span>
            <span class="poll-percentage">${ option.percentage }%</span>
          </div>
        </div>
      `

      if (!this.selected){
        voteForm.querySelector('.poll-option').addEventListener('click', () => {
          fetch(this.serverURL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({add: option.label})
          })
          .then(() => {
            this.selected = option.label
            
            sessionStorage.setItem("poll-selected", option.label)

            this._refresh()
          })
        })
      }
      voteForm.querySelector('.poll-option-fill').style.width = `${ option.percentage }%`
      voteForm.querySelector('.poll-option-info').style.width = `${ option.percentage }%`

      this.root.appendChild(voteForm)
    }
    // console.log(data)
  }
}

const p = new Poll(
  document.querySelector('.poll'),
  "Most popular Front-end framework?"
)