const url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const wordElement = document.getElementById("WordLocation")

const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'

const definition = document.getElementById("DefLocation")

const pronunciation = document.getElementById("ProLocation")

const input = document.getElementById("Input")

const search = document.getElementById("Search")

const history = document.getElementById("history-list")

const saved = document.getElementById("SavedWord")

const savedUl = document.getElementById("salved-list")



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
    wordHistory.addEventListener('click', (e) => {
        e.preventDefault()
        // put in function to render the word
        console.log("i was clicked")
    })
    history.appendChild(wordHistory)

    // Full URL for fetch Request
    fullUrl = `${url}${word1}${key}`

     //Make word history persist
     // function persistSavedWord(word) {
    // fetch(fullUrl, {
    //     method: 'POST',
    //     headers: {
    //         // something goes in here with the API key to give us access to the API
    //         // something like this?
    //         // "Authorization": `Api-Key ${fullUrl}`,
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify('Textual content')
    // }).then(res => res.json())
    //     .then(data => console.log(data))
    // }

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

saved.addEventListener('click', (e) => {
    e.preventDefault()
    const savedWord = document.createElement('li')
    savedWord.innerText = correctCase
    savedUl.appendChild(savedWord)
})

    // function persistSavedWord(word) {
    // fetch(fullUrl, {
    //     method: 'POST',
    //     headers: {
    //         // something goes in here with the API key to give us access to the API
    //         // something like this?
    //         // "Authorization": `Api-Key ${fullUrl}`,
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify('Textual content')
    // }).then(res => res.json())
    //     .then(data => console.log(data))
    // }

    // persistSavedWord("kangaroo")
 

// Make the saved words list persist locally by posting them to db.json
// Start the json server with the following command:
// json-server --watch db.json --port 4000
// This function should be called when the 'save word' button is clicked
// function persistSavedWord(word) {
//     fetch(`${url}${word1}${key}`)
//         .then(res => res.json())
//         .then(res => console.log(res))
// }
// fetch("http://localhost:4000", {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ a: word, b: 'Textual content' })
// })
// }

// persistSavedWord("kangaroo")