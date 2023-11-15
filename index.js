
// API
const api = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'
const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'
// start json-server WITHOUT the watch option
const historyUrl = "http://localhost:3000/wordhistory"
const savedWordsUrl = "http://localhost:3000/savedwords"
// grab DOM elements
const history = document.getElementById("history-list")
const wordElement = document.getElementById("WordLocation")
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
// A list of words for the random word function
const allWords = ['Unique', 'Cacophony', 'Aurora', 'Wonky', 'Elixir', 'Labyrinth', 'Idyllic', 'Melancholy', 'Oblivion', 'Paradox']
// keep a list of words in the history and saved lists
const savedWordsArray = []
const historyWordsArray = []
// Specify a limit for the length of the history section
const historyLimit = 12

// When the page loads, display a random word, add it to history, and record it in db.json
const randomIndex = Math.floor(Math.random() * allWords.length);
const randomWord = allWords[randomIndex]
fetchAndDisplay(randomWord)

// When the page loads, populate previously saved words from db.json
fetch(savedWordsUrl)
    .then(res => res.json())
    .then(res => {
        res.forEach(element => {
            renderSavedWord(element.word)
        })
    })

// When the page loads, populates word history from db.json
fetch(historyUrl)
    .then(res => res.json())
    .then(res => {
        res.forEach(element => {
            addToWordHistory(element.word)
        })
    })

// Search bar submit event listner
search.addEventListener('submit', (e) => {
    e.preventDefault()
    // Defines the searched word
    let word1 = input.value
    // uppercase the first letter of the word
    correctCase = word1.charAt(0).toUpperCase() + word1.slice(1);
    fetchAndDisplay(correctCase) // populates the searched word, definition, pronunciation, adds word to the history, and records the word in db.json
    // Resets the search bar
    input.value = ''
})

// Add event listener to the random word button
randomButton.addEventListener('click', (e) => {
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const randomWord = allWords[randomIndex]
    fetchAndDisplay(randomWord)
    persistHistoryWord(randomWord)
})

// Make the delete history button work
historyDeleteButton.addEventListener("click", (e) => {
    e.preventDefault()
    deleteHistory() // deletes all word history from db.json and from the page
})

// Make the saved word button work
saveButton.addEventListener('click', (e) => {
    e.preventDefault()
    postSavedWord(wordElement.children[0].textContent) // Write the saved word to the database
})

// Take a word and put it in the word node
function renderWord(newWord) {
    wordElement.innerHTML = ''
    const wordTag = document.createElement('p')
    wordTag.innerText = newWord
    wordElement.appendChild(wordTag)
    // If there was an error message, remove it
    document.getElementById("error-message").textContent = ''
}

// Take the API's deifinition and put in the definition node
function renderDefinition(newDef) {
    const pTag = document.createElement('p')
    pTag.innerText = newDef
    definition.appendChild(pTag)
}

// Take the API's pronunciation and put it in the pronunciation node
function renderPronunciation(newPro) {
    pronunciation.innerHTML = ''
    const pTag = document.createElement('p')
    pTag.innerText = newPro
    pronunciation.appendChild(pTag)
}

// Each word on the saved list needs a delete button
// This function gets called by the save button
function addDeleteButton(word) {
    const deleteButton = document.createElement('button')
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("delete")
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault()
        // get rid of the saved word's DOM node 
        word.remove()
        // search for the saved word in db.json and get its id in order to delete it
        fetch(savedWordsUrl)
            .then(res => res.json())
            .then(res => {
                // need a variable for the text content of the selected word
                const searchWord = word.querySelector('p').textContent
                for (let i = 0; i < res.length; i++) {
                    // find a matching word in db.json/s
                    if (res[i].word === searchWord) {
                        // when a match is found in the database, retrieve its id
                        index = res[i].id;
                        // now delete from db.json
                        deleteSavedWord(index)
                        break; // Break the loop if the value is found
                    }
                }
            })
    })
    // add the delete button to to the DOM
    word.appendChild(deleteButton)
}

// Returns true if a word is already saved, false otherwise
function checkIfAlreadyListed(word, arr) {
    let checkValue = false
    // iterate through the list of words
    arr.forEach((savedWordsArrayItem) => {
        if (word.trim().toUpperCase() === savedWordsArrayItem.trim().toUpperCase()) {
            checkValue = true;
        }
    }
    )
    return checkValue
}

// When the 'save word' button gets clicked, save the word
function renderSavedWord(word) {
    // record it in our array
    savedWordsArray.push(word)
    // Add it to the DOM
    const savedWord = document.createElement('li')
    const savedWordp = document.createElement('p')
    savedWordp.innerText = word
    savedWordp.classList.add("saved-word")
    // Clicking on a saved word should display it again
    savedWordp.addEventListener('click', (e) => {
        e.preventDefault()
        fetchAndDisplay(word)
    })
    // Add event listener to change the color of the word
    colorChange(savedWordp)
    savedWord.appendChild(savedWordp)
    // give the saved word a delete button
    addDeleteButton(savedWord)
    savedUl.appendChild(savedWord)
}

// When a word is saved, write it to db.json
function postSavedWord(wordSaved) {
    if (!(checkIfAlreadyListed(wordSaved, savedWordsArray))) {
        renderSavedWord(wordSaved)
        persistSavedWord(wordSaved)
    }
}

// Add Event Listeners. Words should turn green on mouseover, then turn back to their previous color on mouseout
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

// Add a word to the history list
function addToWordHistory(historyWord) {
    // first make sure it isn't already in the history
    if (!(checkIfAlreadyListed(historyWord, historyWordsArray))) {
        // record it in the history array
        historyWordsArray.unshift(historyWord)
        // Create a DOM node for the new entry in the history
        const wordHistory = document.createElement('li')
        wordHistory.innerText = historyWord
        // Click on the word to display it again
        wordHistory.addEventListener('click', (e) => {
            e.preventDefault()
            fetchAndDisplay(wordHistory.textContent)
        })
        // MAke the word change color on mouseover
        colorChange(wordHistory)
        // Appends the word to the top of the history section
        history.insertBefore(wordHistory, history.firstChild);
        // if the history list is excessively long, shorten it
        while (history.querySelectorAll('li')[historyLimit]) {
            history.querySelectorAll('li')[historyLimit].remove()
        }
        historyWordsArray.length = historyLimit
    }
}

// Remove all the <li> tags in the history section 
function deleteHistoryLis() {
    const entireHistory = history.querySelectorAll('li')
    entireHistory.forEach((element) => {
        element.remove()
    })
    // make our history array empty
    historyWordsArray.length = 0
}

// Stretch goal: add a delete history button that wipes the history in the db
// The delete button will call this function
function deleteHistory() {
    deleteHistoryLis()
    fetch(historyUrl)
        .then(res => res.json())
        .then(res => {
            // for all entries in the db
            for (let i = 0; i < res.length; i++) {
                // get the entry's id
                index = res[i].id;
                // fetch delete the id
                deleteWordHistory(index)
            }
        })
}

// gets a word object from the dictionary and process it
function fetchAndDisplay(theWord) {
    let wordIsInTheDictionary = false
    let url = `${api}${theWord}${key}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // check if the word is in the dictionary
            if (data[0].shortdef) {
                wordIsInTheDictionary = true
                // Accesses Saved Definitions
                const definitions = data[0].shortdef
                // Accesses Saved Pronuciation
                const pronounced = data[0].hwi.hw
                // Renders pronuciation to the Pronuciation: section
                renderPronunciation(pronounced)
                // Resets resets definition
                definition.innerHTML = ''
                // show the word in the definition section
                renderWord(theWord)
                // Renders all definitions
                definitions.forEach(element => {
                    renderDefinition(element)
                })
                // Add to the word history
                addToWordHistory(theWord)
                // Add the word to the history section of the db.json
                persistHistoryWord(theWord)
            }
            // If the word is not in the dictionary
            else {
                errorMessage.textContent = `${theWord} is not in the dictionary. Try another word.`
            }
        })
}

// When the 'saved word' button is clicked, enter the word to db.json
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

// When a word is added to history, enter it in db.json
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

// When the delete button on a saved word is clicked, delete the word from db.json
function deleteSavedWord(word) {
    fetch(`${savedWordsUrl}/${word}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
}

// When the 'delete history' button is clicked, clear out the history section of db.json
// This gets called in a loop
function deleteWordHistory(word) {
    fetch(`${historyUrl}/${word}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
}