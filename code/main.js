//#region ---------- Read from JSON ----------
async function readFromJSON(filename) {
    try {
        const filepath = `/data/${filename}.json`;
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

async function getAllGames() {
    const games = await readFromJSON("games");
    return games.games;
}

async function getAllSituations() {
    const situations = await readFromJSON("situations");
    return situations.situations;
}

async function getAllSentences() {
    const items = await readFromJSON("items");
    return items.sentences;
}

async function getAllEmotions() {
    const items = await readFromJSON("items");
    return items.emotions;
}

async function getAllEvents() {
    const items = await readFromJSON("items");
    return items.events;
}

//#endregion Read from JSON

//#region ---------- Storage Modification ----------
function setItemInStorage(item, value) {
    let valuestr = JSON.stringify(value);
    sessionStorage.setItem(item, valuestr);
}

function getItemFromStorage(item) {
    let result = sessionStorage.getItem(item);
    result = JSON.parse(result);
    return result;
}

function removeGame() {
    setItemInStorage("game", null);
}

//#endregion Storage Modification

//#region ---------- Helpers ----------
function createHTMLTag(type, id, classes) {
    const tag = document.createElement(type);
    if(id != null) {
        tag.id = id;
    }

    classes.forEach(item => {
        tag.classList.add(item);
    });

    return tag;
}

function generateRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

//#endregion Helpers

