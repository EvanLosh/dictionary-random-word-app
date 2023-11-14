const api = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const wordElement = document.getElementById("WordLocation")

const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'

const definition = document.getElementById("DefLocation")

const pronunciation = document.getElementById("ProLocation")

const input = document.getElementById("Input")

const search = document.getElementById("Search")

const history = document.getElementById("history-list")

const saveButton = document.getElementById("save-this-word")

const savedUl = document.getElementById("salved-list")

// const li = document.getElementById("reference")

const randomButton = document.getElementById("RamdomButtom")

const allWords = ['Stuff', 'Things', 'Arrived', 'Arrogancy', 'Arrogate', 'Arsenide', 'Arshin', 'Arterio', 'Artful']

const jsonUrl = 'http://localhost:3000/savedwords'

// When the page loads, display a random word
const randomIndex = Math.floor(Math.random() * allWords.length);
const randomWord = allWords[randomIndex]
fetchAndDisplay(randomWord)

// When the page loads, populate previously saved words from the local databse
fetch(jsonUrl)
    .then(res => res.json())
    .then((data) => {
        data.forEach(element => {
            renderSavedWord(element.word)
        })
    })

// Search bar submit event listner
search.addEventListener('submit', (e) => {
    e.preventDefault()

    // Defines the searched word
    let word1 = input.value

    // uppercase the first letter of the word
    correctCase = word1.charAt(0).toUpperCase() + word1.slice(1);

    fetchAndDisplay(correctCase)
    // Resets the search bar
    input.value = ''
})

// Add event listner to the save word button
saveButton.addEventListener('click', (e) => {
    e.preventDefault()
    renderSavedWord(wordElement.children[0].textContent)
    // addDeleteButton(savedWord)
})

// Add event listener to the random word button
randomButton.addEventListener('click', (e) => {
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const randomWord = allWords[randomIndex]
    fetchAndDisplay(randomWord)
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

// Shows the word in the definition card
function renderWord(newWord) {
    wordElement.innerHTML = ''
    const wordTag = document.createElement('p')
    wordTag.innerText = newWord
    wordElement.appendChild(wordTag)
}

// Each word on the saved list needs a delete button
function addDeleteButton(word) {
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete'
    word.appendChild(deleteButton)
}

// Returns true if a word is already saved, false otherwise
function checkIfAlreadySaved(word) {
    savedUl.querySelectorAll('li').forEach((li) => {
        console.log(li)
        // let liWord = li.contents().filter(function () { return this.nodeType == Node.TEXT_NODE; })[0]
        let liWord = li.textContent
        console.log(liWord) // li.textContent is changed when the delete button is added
        if (word.toUpperCase() == liWord.toUpperCase()) {
            return true
        }
    })
    return false
}






// Add a word to the saved word list. called by the save button.
function renderSavedWord(wordSaved) {
    if (checkIfAlreadySaved(wordSaved)) {
        // If the word is already saved, stop the function here
        return ''
    }
    const savedWord = document.createElement('li')
    savedWord.innerText = wordSaved
    savedWord.addEventListener('click', (e) => {
        e.preventDefault()
        fetchAndDisplay(savedWord.textContent)
    })
    colorChange(savedWord)
    addDeleteButton(savedWord)
    savedUl.appendChild(savedWord)
    persistSavedWord(wordSaved)
}

// Words should turn green on mouseover, then turn back to their previous color on mouseout
function colorChange(element) {
    let initialColor = element.style.color
    element.addEventListener("mouseover", (e) => {
        e.preventDefault()
        element.style.color = "green"
    })
    element.addEventListener("mouseout", (e) => {
        e.preventDefault()
        element.style.color = initialColor
    })
}

// Add a word to the history list. Called by 
function addToWordHistory(historyWord) {
    const wordHistory = document.createElement('li')
    wordHistory.innerText = historyWord
    // Add event listner to the element
    wordHistory.addEventListener('click', (e) => {
        e.preventDefault()
        fetchAndDisplay(wordHistory.textContent)
    })
    colorChange(wordHistory)
    // Appends the word to the history section
    history.insertBefore(wordHistory, history.firstChild);
}

function fetchAndDisplay(theWord) {
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
    addToWordHistory(randomWord)
    renderWord(theWord)
}

// Make the saved words list persist locally by posting them to db.json
// This function should be called when the 'save word' button is clicked
function persistSavedWord(gold) {
    fetch("http://localhost:3000/savedwords", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "word": gold })
    })
        .then(res => res.json())
        .then((res) => console.log(res))
}