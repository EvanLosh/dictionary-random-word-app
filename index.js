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

const jsonUrl = 'http://localhost:3000/savedwords'

fetch(jsonUrl)
    .then(res => res.json())
    .then((data) => {
        data.forEach(element => {
            renderSavedWord(element.word)
        })
    })


const randomIndex = Math.floor(Math.random() * randomWords.length);
const randomElement = randomWords[randomIndex]

generateUrl(randomElement)
addToWordHidtory(randomElement)

// Search bar submit event listner
search.addEventListener('submit', (e) => {
    e.preventDefault()

    // Defines the searched word
    let word1 = input.value

    // uppercase the first letter of the word
    correctCase = word1.charAt(0).toUpperCase() + word1.slice(1);

    renderWord(correctCase)

    addToWordHidtory(correctCase)

    generateUrl(correctCase)
    // Resets the search bar
    input.value = ''
})

// Add event listner to the saved word button
saved.addEventListener('click', (e) => {
    e.preventDefault()
    renderSavedWord(wordElement.children[0].textContent)
    // addDeleteButton(savedWord)
})

randomButton.addEventListener('click', (e) => {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    const randomElement = randomWords[randomIndex]
    generateUrl(randomElement)
    addToWordHidtory(randomElement)
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
function addDeleteButton(word) {
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete'
    word.appendChild(deleteButton)
}

function checkIfAlreadySaved(word) {
    let checkValue = false
    savedUl.querySelectorAll('li').forEach((li) => {
        console.log(li.textContent.trim()) // li.textContent is changed when the delete button is added
        if (word.toUpperCase() == (li.textContent.trim().toUpperCase())) {
            checkValue = true
            return checkValue
        }
    })
    return checkValue
}

function renderSavedWord(wordSaved) {
    if (checkIfAlreadySaved(wordSaved)) {
        // If the word is already saved, stop the function here
        return ''
    }
    else {
        const savedWord = document.createElement('li')
        savedWord.innerText = wordSaved
        savedWord.addEventListener('click', (e) => {
            e.preventDefault()
            generateUrl(savedWord.textContent)
        })
        colorChange(savedWord)
        addDeleteButton(savedWord)
        savedUl.appendChild(savedWord)
        // debugger
        persistSavedWord(savedWord.textContent.trim())
    }
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

function addToWordHidtory(historyWord) {
    const wordHistory = document.createElement('li')
    wordHistory.innerText = historyWord
    // Add event listner to the element
    wordHistory.addEventListener('click', (e) => {
        e.preventDefault()
        generateUrl(wordHistory.textContent)
    })
    //call the function to add the event listener to change the color of a word when you put your mouse over it
    colorChange(wordHistory)
    // Appends the word to the history section
    history.insertBefore(wordHistory, history.firstChild);
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