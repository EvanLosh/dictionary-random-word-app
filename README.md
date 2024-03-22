# dictionary-random-word-app
This front-end web app allows users to enter a word to look up its definition in Merriam-Webster's dictionary API. Click a button to look up a random word. A list of all words returned by the API is saved on a mock database. A list of selected favorite words is also saved. Clicked on a saved word to view it again.

The application was coded using pure Javascript, HTML, and CSS.

# Obtaining an API key

The user must obtain their own key for Merriam Webster's Dictionary API here [https://dictionaryapi.com/register/index](https://dictionaryapi.com/register/index). 


# To run the application

Install json-server:

`$ npm install -g json-server`

Fork and clone this repository. Create a file called `key.json` in the project directory, 

`$ touch key.json`

and copy the following text into that file:

```
{
    "apiKey": [
        {
            "key": "<your api key>"
        }
    ]
}
```

Replace `<your api key>` with your api key. 

In the project directory, run these shell scripts to create the app database 


```
$ chmod +x new-db.sh
$ ./new-db.sh
```


and convert the list of every word in the dictionary from the text file into a JSON database:

```
$ chmod +x txt-to-json.sh
$ ./txt-to-json.sh
```


In three different terminals, start these mock servers:

```
$ json-server db.json --port 8000
$ json-server key.json --port 8001
$ json-server every-word-in-the-dictionary.json --port 8002
```

Finally, open the `index.html` in a web browser.







<!-- Wireframe link:
https://www.figma.com/file/Oo9icJDMEOXXdqx6vITVhz/Email-Template-MVP?type=whiteboard&node-id=0%3A1&t=imCtQsMXsZaKk0qM-1

Wireframe:
<img width="1384" alt="Screenshot 2023-11-13 at 3 08 29 PM" src="https://github.com/EvanLosh/dictionary-random-word-app/assets/145052899/58013617-135a-4d3d-a896-46ce9b7cfbac">

Trello:
<img width="1140" alt="Screenshot 2023-11-13 at 3 11 14 PM" src="https://github.com/EvanLosh/dictionary-random-word-app/assets/145052899/be323883-1930-4959-94cb-a3fdf3df72d0">

Trello link:
https://trello.com/invite/b/wdtQb9WM/ATTId6513feac452ea81be14c09d00a1d833B6DB5929/email-template-board

Example url for getting a word
https://api.dictionaryapi.dev/api/v2/entries/en/word

Example url for getting the whole dictionary
https://api.dictionaryapi.dev/api/v2/entries/en/

Deliverable #1
Create wireframe/boilerplate HTML page

Deliverable #2
Add a form to search for a word and fetch it from the dictionary API

Deliverable #3
Display the word that was fetched. Include pronunciation, definitions, synonyms.

Deliverable #4
Add a word history list. Whenever a word is displayed, add it to the list. (not persisting)

Deliverable #5
Add a saved word list and a button to add the current word to the saved word list. Add a delete button to remove words.

Deliverable #6
Click on a word from the list to display it again

Deliverable #7 
Change style of a word in the history when hovering mouse over it

Deliverable #8 Make the saved word list persist (when the page is refreshed, load saved words from db.json and populate them on the webpage again) 

Stretch goal #1 When the page loads, display the word of the day (persists when reloading the page, changes from day to day)

Stretch goal #2 In the saved words list, drag and drop words to reorder them.

Stretch goal #3 Latest 10 words in the history will persist -->









