const api = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const history = document.getElementById("history-list")

const historyUrl = "http://localhost:3000/wordhistory"

const savedWordsUrl = "http://localhost:3000/savedwords"

const wordElement = document.getElementById("WordLocation")

const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'

const definition = document.getElementById("DefLocation")

const pronunciation = document.getElementById("ProLocation")

const input = document.getElementById("Input")

const search = document.getElementById("Search")

const saveButton = document.getElementById("save-this-word")

const savedUl = document.getElementById("saved-list")

const randomButton = document.getElementById("RamdomButtom")

const errorMessage = document.getElementById("error-message")

const historyTitle = document.getElementById("WordHistory")

const historyDeleteButton = document.getElementById("delete-history")

const allWords = ['Unique', 'Cacophony', 'Aurora', 'Wonky', 'Elixir', 'Labyrinth', 'Idyllic', 'Melancholy', 'Oblivion', 'Paradox']

const savedWordsArray = []
const historyWordsArray = []
const historyLimit = 12

// When the page loads, display a random word
const randomIndex = Math.floor(Math.random() * allWords.length);
const randomWord = allWords[randomIndex]
fetchAndDisplay(randomWord)
// persistHistoryWord(randomWord)

// When the page loads, populate previously saved words from the local databse
fetch(savedWordsUrl)
    .then(res => res.json())
    .then(res => {
        res.forEach(element => {
            renderSavedWord(element.word)
        })
    })


fetch(historyUrl)
    .then(res => res.json())
    .then(res => {
        res.forEach(element => {
            addToWordHistory(element.word)
        })
    })

historyDeleteButton.addEventListener("click", (e) => {
    e.preventDefault()
    // console.log('i was clicked')
    deleteHistory()
    // deleteHistoryLis()
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
    postSavedWord(wordElement.children[0].textContent)
})

// Add event listener to the random word button
randomButton.addEventListener('click', (e) => {
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const randomWord = allWords[randomIndex]
    fetchAndDisplay(randomWord)
    persistHistoryWord(randomWord)
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
    document.getElementById("error-message").textContent = ''
}

// Each word on the saved list needs a delete button
function addDeleteButton(word) {
    const deleteButton = document.createElement('button')
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("delete")
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault()
        word.remove()
        fetch(savedWordsUrl)
            .then(res => res.json())
            .then(res => {
                const searchWord = word.querySelector('p').textContent
                for (let i = 0; i < res.length; i++) {
                    if (res[i].word === searchWord) {
                        index = res[i].id;
                        deleteSavedWord(index)
                        break; // Break the loop if the value is found
                    }
                }
            })
    })
    word.appendChild(deleteButton)
}

// Returns true if a word is already saved, false otherwise
function checkIfAlreadyListed(word, arr) {
    let checkValue = false
    arr.forEach((savedWordsArrayItem) => {
        if (word.trim().toUpperCase() === savedWordsArrayItem.trim().toUpperCase()) {
            checkValue = true;
        }
    }
    )
    return checkValue
}

function renderSavedWord(word) {
    savedWordsArray.push(word)
    const savedWord = document.createElement('li')
    const savedWordp = document.createElement('p')
    savedWordp.innerText = word
    savedWordp.classList.add("saved-word")
    savedWordp.addEventListener('click', (e) => {
        e.preventDefault()

        fetchAndDisplay(word)
    })
    colorChange(savedWordp)
    savedWord.appendChild(savedWordp)
    addDeleteButton(savedWord)
    savedUl.appendChild(savedWord)
}

function postSavedWord(wordSaved) {
    if (!(checkIfAlreadyListed(wordSaved, savedWordsArray))) {
        renderSavedWord(wordSaved)
        persistSavedWord(wordSaved)
    }
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
    if (!(checkIfAlreadyListed(historyWord, historyWordsArray))) {
        historyWordsArray.unshift(historyWord)
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
        // while a 13th history node exists, remove it
        while (history.querySelectorAll('li')[historyLimit]) {
            history.querySelectorAll('li')[historyLimit].remove()
        }
        // Remove all elements in the array with indices greater than the history limit
        historyWordsArray.length = historyLimit
    }
}

function deleteHistoryLis() {
    const entireHistory = history.querySelectorAll('li')
    console.log(entireHistory)
    entireHistory.forEach((element) => {
        console.log(element)
        element.remove()
    })
    historyWordsArray.length = 0
    console.log(`history array length is ${historyWordsArray.length}`)
}

// Stretch goal: add a delete history button that wipes the history in the db
function deleteHistory() {
    deleteHistoryLis()
    fetch(historyUrl)
        .then(res => res.json())
        .then(res => {
            // const searchWord = word.querySelector('li').textContent
            console.log(`history db length is ${res.length}`)
            // debugger
            for (let i = 0; i < res.length; i++) {
                if (true) {
                    index = res[i].id;
                    console.log(index)
                    // debugger
                    deleteWordHistory(index)
                    // debugger
                }

            }
        })

}







function fetchAndDisplay(theWord) {
    let wordIsInTheDictionary = false
    let url = `${api}${theWord}${key}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data[0].shortdef) {
                wordIsInTheDictionary = true
                // Accesses Saved Definitions
                const definitions = data[0].shortdef

                // Accesses Saved Pronuciation
                const pronounced = data[0].hwi.hw

                // Renders saved pronuciation to the Pronuciation: section
                renderPronunciation(pronounced)

                // Resets resets definition
                definition.innerHTML = ''

                renderWord(theWord)
                // Renders all definitions
                definitions.forEach(element => {
                    renderDefinition(element)
                })
                addToWordHistory(theWord)
                persistHistoryWord(theWord)
            }
            else {
                errorMessage.textContent = `${theWord} is not in the dictionary. Try another word.`
            }
        })
}


// Make the saved words list persist locally by posting them to db.json
// This function should be called when the 'save word' button is clicked


function persistSavedWord(word) {
    fetch(savedWordsUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'word': word })
    })
}



function persistHistoryWord(word) {
    fetch(historyUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "word": word })
    })
}

function deleteSavedWord(word) {
    fetch(`${savedWordsUrl}/${word}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
}

function deleteWordHistory(word) {
    // debugger
    fetch(`${historyUrl}/${word}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
}