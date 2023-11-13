const url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const word = document.getElementById("Word")

const definition = document.getElementById("DefitnitionText")

const pronunciation = document.getElementById("Pronunciation")

const input = document.getElementById("Input")

const search = document.getElementById("Search")

let word1 = ''

search.addEventListener('submit', (e) => {
    e.preventDefault()
    word1 = input.value
    const wordTag = document.createElement('p')
    wordTag.innerText = word1
    word.appendChild(wordTag)

    // console.log(word1)

    fetch(`${url}${word1}${key}`)
        .then(res => res.json())
        .then((data) => {
            definitions = data[0].shortdef
            pronounced = data[0].hwi.hw
            renderPronunciation(pronounced)
            definitions.forEach(element => {
                renderDefinition(element)
            });
        })
})

function renderDefinition(newDef) {
    const pTag = document.createElement('p')
    pTag.innerText = newDef
    definition.appendChild(pTag)
}

function renderPronunciation(newPro) {
    const pTag = document.createElement('p')
    pTag.innerText = newPro
    pronunciation.appendChild(pTag)
}