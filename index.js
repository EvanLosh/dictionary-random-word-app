const url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const word = document.getElementById("WordLocation")

const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'

const definition = document.getElementById("DefLocation")

const pronunciation = document.getElementById("ProLocation")

const input = document.getElementById("Input")

const search = document.getElementById("Search")

const history = document.getElementById("history-list")

search.addEventListener('submit', (e) => {
    e.preventDefault()
    word.innerHTML = ''
    word1 = input.value
    // uppercase the first letter of the word
    const wordTag = document.createElement('p')
    wordTag.innerText = word1
    word.appendChild(wordTag)

    const wordHistory = document.createElement('li')
    wordHistory.innerText = word1
    wordHistory.addEventListener('click', (e) => {
        console.log(wordHistory)
    })
    history.appendChild(wordHistory)
    // make word history persist

    // console.log(word1)

    fetch(`${url}${word1}${key}`)
        .then(res => res.json())
        .then((data) => {
            const definitions = data[0].shortdef
            const pronounced = data[0].hwi.hw
            renderPronunciation(pronounced)
            definition.innerHTML = ''
            definitions.forEach(element => {
                renderDefinition(element)
            });
        })
    input.value = ''
})

function renderDefinition(newDef) {
    const pTag = document.createElement('p')
    pTag.innerText = newDef
    definition.appendChild(pTag)
}

function renderPronunciation(newPro) {
    pronunciation.innerHTML = ''
    const pTag = document.createElement('p')
    pTag.innerText = newPro
    pronunciation.appendChild(pTag)
}