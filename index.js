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

const randomWords = ['Stuff', 'Things', 'Arrived', 'Arrogancy', 'Arrogate', 'Arsenide', 'Arshin', 'Arterio', 'Artful']

const randomIndex = Math.floor(Math.random() * randomWords.length);
const randomElement = randomWords[randomIndex]

generateUrl(randomElement)

// Search bar submit event listner
search.addEventListener('submit', (e) => {
    e.preventDefault()

    // Defines the searched word
    let word1 = input.value

    // uppercase the first letter of the word
    correctCase = word1.charAt(0).toUpperCase() + word1.slice(1);

    renderWord(correctCase)

    // Add the searched word to the history section
    const wordHistory = document.createElement('li')
    wordHistory.innerText = correctCase
    // Add event listner to the element
    wordHistory.addEventListener('click', (e) => {
        e.preventDefault()
        generateUrl(wordHistory.textContent)
    })
    //call the function to add the event listener to change the color of a word when you put your mouse over it
    colorChange(wordHistory)
    // Appends the word to the history section
    history.insertBefore(wordHistory, history.firstChild);
    // history.appendChild(wordHistory)

    generateUrl(correctCase)
    // Resets the search bar
    input.value = ''
})

// Add event listner to the saved word button
saved.addEventListener('click', (e) => {
    e.preventDefault()
    // create saved word
    const savedWord = document.createElement('li')
    savedWord.innerText = wordElement.children[0].textContent
    // add event lisner to the element
    savedWord.addEventListener('click', (e) => {
        e.preventDefault()
        generateUrl(savedWord.textContent)
    })
    colorChange(savedWord)
    // Appends the word to the saved word section
    savedUl.appendChild(savedWord)
})

randomButton.addEventListener('click', (e) => {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    const randomElement = randomWords[randomIndex]
    generateUrl(randomElement)
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

function colorChange(element) {
    let defaultColor = element.style.color
    element.addEventListener("mouseover", (e) => {
        e.preventDefault()
        element.style.color = "green"
    })
    element.addEventListener("mouseout", (e) => {
        e.preventDefault()
        element.style.color = defaultColor
    })
}

function generateUrl(theWord) {
    let url = `${api}${theWord}${key}`
    fetch(url)
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
    renderWord(theWord)
}

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