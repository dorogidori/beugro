//#region ---------- Read from JSON ----------
async function readFromJSON(filename) {
    try {
        const base = new URL('../data/', import.meta.url);
        const url = new URL(`${filename}.json`, base);      
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function getAllGames() {
    const games = await readFromJSON("games");
    return games.games;
}

export async function getAllSituations() {
    const situations = await readFromJSON("situations");
    return situations.situations;
}

export async function getAllSentences() {
    const items = await readFromJSON("items");
    return items.sentences;
}

export async function getAllEmotions() {
    const items = await readFromJSON("items");
    return items.emotions;
}

export async function getAllEvents() {
    const items = await readFromJSON("items");
    return items.events;
}

//#endregion Read from JSON

//#region ---------- Storage Modification ----------
export function setItemInStorage(item, value) {
    let valuestr = JSON.stringify(value);
    sessionStorage.setItem(item, valuestr);
}

export function getItemFromStorage(item) {
    let result = sessionStorage.getItem(item);
    result = JSON.parse(result);
    return result;
}

export function removeGame() {
    setItemInStorage("game", null);
}
window.removeGame = removeGame;

//#endregion Storage Modification

//#region ---------- Helpers ----------
export function createHTMLTag(type, id, classes) {
    const tag = document.createElement(type);
    if(id != null) {
        tag.id = id;
    }

    classes.forEach(item => {
        tag.classList.add(item);
    });

    return tag;
}

export function generateRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

export function generateDifferentNumber(max, count = 5) {
    let numbers = getItemFromStorage("numbers");
    numbers = numbers ? numbers : [];

    let n = generateRandomNumber(max);
    while(numbers.includes(n)) {
        n = generateRandomNumber(max);
    }
    
    if(numbers.length >= count) {
        numbers.shift();
    }

    numbers.push(n);
    setItemInStorage("numbers", numbers);
    return n;
}

//#endregion Helpers

