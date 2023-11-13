const url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'

const key = '?key=b2eaff5c-5497-49e8-8484-9745a09a2b2a'

const header = document.getElementById("Header")

const random = document.getElementById("Random")

const day = document.getElementById("Day")

const definition = document.getElementById("Definition")

const history = document.getElementById("History")

const saved = document.getElementById("Saved")

const submitButton = document.getElementById("Submit")

const input = document.getElementById("Input")

submitButton.addEventListener('click', (e) => {
    e.preventDefault()
    word = input.value
    console.log(word)

    fetch(`${url}${word}${key}`)
        .then(res => res.json())
        .then((data) => {
            console.log(data)
        })
})

let word = ''
