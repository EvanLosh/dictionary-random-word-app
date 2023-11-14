const api = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const wordElement = document.getElementById("WordLocation")

const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'

const definition = document.getElementById("DefLocation")

const pronunciation = document.getElementById("ProLocation")

const input = document.getElementById("Input")

const search = document.getElementById("Search")

const history = document.getElementById("history-list")

const saved = document.getElementById("SavedWord")

const savedUl = document.getElementById("salved-list")

const li = document.getElementById("reference")

const randomButton = document.getElementById("RamdomButtom")

// Search bar submit event listner
search.addEventListener('submit', (e) => {
    e.preventDefault()

    // Resets the Word: section
    wordElement.innerHTML = ''

    // Defines the searched word
    let word1 = input.value

    // uppercase the first letter of the word
    correctCase = word1.charAt(0).toUpperCase() + word1.slice(1);

    // Add searched word to the Word: section
    const wordTag = document.createElement('p')
    wordTag.innerText = correctCase
    wordElement.appendChild(wordTag)

    // Add the searched word to the history section
    const wordHistory = document.createElement('li')
    wordHistory.innerText = correctCase
    // Add event listner to the element
    wordHistory.addEventListener('click', (e) => {
        e.preventDefault()
        // Create api of the historical word
        const historyUrl = `${api}${wordHistory.textContent}${key}`
        // Fetch the historical word data
        fetch(historyUrl)
            .then(res => res.json())
            .then((data) => {
                // Accesses Historical Definitions
                const definitions = data[0].shortdef

                // Accesses History Pronuciation
                const pronounced = data[0].hwi.hw

                // Renders historical pronuciation to the Pronuciation: section
                renderPronunciation(pronounced)

                // Resets the definition
                definition.innerHTML = ''

                // Renders all definitions
                definitions.forEach(element => {
                    renderDefinition(element)
                })
            })
        renderWord(wordHistory.textContent)
    })
    // Appends the word to the history section
    history.insertBefore(wordHistory, history.firstChild);
    // history.appendChild(wordHistory)


    // URL with searched word for fetch Request
    fullUrl = `${api}${correctCase}${key}`

    // Fetch request
    fetch(fullUrl)
        .then(res => res.json())
        .then((data) => {

            // Accesses Definitions
            const definitions = data[0].shortdef

            // Accesses Pronuciation
            const pronounced = data[0].hwi.hw

            // Renders pronuciation to the Pronuciation: section
            renderPronunciation(pronounced)

            // Resets the definition
            definition.innerHTML = ''

            // Renders all definitions
            definitions.forEach(element => {
                renderDefinition(element)
            });
        })
    // Resets the search bar
    input.value = ''
})

// Function for rendering Definition to the Definition: Section
function renderDefinition(newDef) {
    const pTag = document.createElement('p')
    pTag.innerText = newDef
    definition.appendChild(pTag)
}

// Function for rendering Pronuciation to the Pronuciation: Section
function renderPronunciation(newPro) {
    pronunciation.innerHTML = ''
    const pTag = document.createElement('p')
    pTag.innerText = newPro
    pronunciation.appendChild(pTag)
}

function renderWord(newWord) {
    wordElement.innerHTML = ''
    const wordTag = document.createElement('p')
    wordTag.innerText = newWord
    wordElement.appendChild(wordTag)
}


// Add event listner to the saved word button
saved.addEventListener('click', (e) => {
    e.preventDefault()
    // create saved word
    const savedWord = document.createElement('li')
    savedWord.innerText = wordElement.children[0].textContent
    // add event lisner to the element
    savedWord.addEventListener('click', (e) => {
        e.preventDefault()
        // Create api of the saved word
        const savedUrl = `${api}${savedWord.textContent}${key}`
        // Fetch the saved word data
        fetch(savedUrl)
            .then(res => res.json())
            .then((data) => {
                // Accesses Saved Definitions
                const definitions = data[0].shortdef

                // Accesses Saved Pronuciation
                const pronounced = data[0].hwi.hw

                // Renders saved pronuciation to the Pronuciation: section
                renderPronunciation(pronounced)

                // Resets resets definition
                definition.innerHTML = ''

                // Renders all definitions
                definitions.forEach(element => {
                    renderDefinition(element)
                })
            })
        renderWord(savedWord.textContent)
    })
    // Appends the word to the saved word section
    savedUl.appendChild(savedWord)
})

// Make the saved words list persist locally by posting them to db.json
// Start the json server with the following command:
// json-server --watch db.json --port 4000
// This function should be called when the 'save word' button is clicked
// fetch("http://localhost:4000", {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ a: word, b: 'Textual content' })
// })

// persistSavedWord("kangaroo")

const randomWords = ['Stuff', 'Things', 'Arrived', 'Arrogancy', 'Arrogate', 'Arsenide', 'Arshin', 'Arterio', 'Artful']

const randomIndex = Math.floor(Math.random() * randomWords.length);

const randomElement = randomWords[randomIndex]

const randomUrl = `${api}${randomElement}${key}`

randomButton.addEventListener('click', (e) => {
    e.preventDefault
    fetch(randomUrl)
        .then(res => res.json())
        .then(data => {
            // Accesses Saved Definitions
            const definitions = data[0].shortdef

            // Accesses Saved Pronuciation
            const pronounced = data[0].hwi.hw

            // Renders saved pronuciation to the Pronuciation: section
            renderPronunciation(pronounced)

            // Resets resets definition
            definition.innerHTML = ''

            // Renders all definitions
            definitions.forEach(element => {
                renderDefinition(element)
            })
        })
    renderWord(randomElement)
})
