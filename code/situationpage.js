import {createHTMLTag, getItemFromStorage, setItemInStorage, getAllGames} from './main.js';

document.addEventListener('DOMContentLoaded', async () => { 
    await getBasicGames();
    getDataFromStorage();
    refreshGame();
    refreshSituation();

    console.log(game);
    console.log(games);
    console.log(gameOptions);
    console.log(situation);
    console.log(playerNames);
});

let game = "";
let games = [];
let gameOptions = [];
let basicGameNames = [];
let situation = {};
let playerNames = Array(4).fill(null);;

async function getBasicGames() {
    const result = await getAllGames();
    games = result.filter((game) => {return game.display});
    basicGameNames = games.filter((game) => {return game.basic}).map((game) => {return game.name});
}

function getDataFromStorage() {
    game = getItemFromStorage("game");
    let result = getItemFromStorage("situation");

    situation = {
        description: result.description,
        roles: result.roles,
        keywords: result.keywords,
        data: {}
    }

    //game = "1-2-3-4";
    
    let variations = result.variations.map((game) => {return game.game});
    gameOptions = basicGameNames.concat(variations).sort();
    let specific = result.variations.find((variation) => {return variation.game == game});

    if(specific) {
        if(specific.description) {
            situation.description = `${situation.description} ${specific.description}`
        }
        if(specific.extraroles) {
            situation.roles = situation.roles.concat(specific.extraroles);
            //playerNames = Array(situation.roles.length).fill(null);
        }
        situation.data = specific.data;
    }
    
    if(game) {
        const playbutton = document.getElementById("playbutton");
        playbutton.classList.remove("hideelement");
    }
}

//#region ---------- Game ----------
function refreshGame() {
    displayGameDescription();
    displayVariations();
}

function displayGameDescription() {
    const infosection = document.getElementById("gamedescriptionsection");
    infosection.innerHTML = "";

    const gamename = document.getElementById("gamename");

    if(!game) {
        infosection.classList.add("hideelement");
        gamename.innerHTML = "";
        gamename.classList.add("hideelement");
        return;
    }

    infosection.classList.remove("hideelement");
    gamename.classList.remove("hideelement");
    gamename.textContent = game;
}

function displayVariations() {
    const variations = document.getElementById("situation-variations");
    variations.textContent = "";

    gameOptions.forEach((option) => {
        if (option != game) {
            const button = createHTMLTag("button", null, ["smallbutton"]);
            button.textContent = option;
            button.addEventListener("click", (event) => {
                const target = event.target;
                console.log(target.textContent);
                setItemInStorage("game", target.textContent);
                getDataFromStorage();
                refreshGame();
                refreshSituation();
            })
            variations.appendChild(button);
        }
    })
}


//#endregion Game

//#region ---------- Situation ----------
function refreshSituation() {
    let description = document.getElementById("situation-description");
    description.textContent = situation.description;

    let keywords = document.getElementById("situation-keywords");
    keywords.textContent = "";
    situation.keywords.forEach((keyword) => {
        const label = createHTMLTag("div", null, ["situationlistitem-keywords-label"]);
        label.textContent = keyword;
        keywords.appendChild(label);
    });

    displayRolesTable();

    displaySpecialInfo();
}

function displayRolesTable() {
    let table = document.getElementById("situation-roles");
    table.innerHTML = "";

    situation.roles.forEach((role, i) => {

        let rolecell = createHTMLTag("div", null, ["playerrolecell"]);
        rolecell.textContent = role; 
        table.appendChild(rolecell);

        let namecell = createHTMLTag("div", null, ["playernamecell"]);
        let input = createHTMLTag("input", null, ["playernameinput"]);
        input.type = "text";
        input.maxlength = 20;
        input.placeholder = `${i + 1}. játékos neve`;
        if(playerNames[i]) {
            input.value = playerNames[i];
        }
        input.addEventListener("blur", (event) => {
            let target = event.target;
            let text = target.value.trim();
            target.value = text;

            let cell = document.getElementById(`${role}-text`);
            playerNames[i] = text;
            if(cell) {
                cell.textContent = text ? text : role;
            }
        })
        namecell.appendChild(input);
        table.appendChild(namecell);
    })
}

function displaySpecialInfo() {
    switch(game) {
        case "Kétlövetű" : {displayKetlovetuInfo(); return;};
        case "1-2-3-4" : {display1234(); return;};
        default: {
            const infosection = document.getElementById("specificsection");
            infosection.classList.add("hideelement");
        }
    }
}

function displayKetlovetuInfo() {
    const infosection = document.getElementById("specificsection");
    infosection.innerHTML = "";
    infosection.classList.remove("hideelement");
    
    const title = createHTMLTag("h3", null,[]);
    title.textContent = "Mondatok"
    infosection.appendChild(title);

    const table = createHTMLTag("div", null, ["gridtable"]);
    Object.keys(situation.data).forEach((role, i) => {

        const rolecell = createHTMLTag("div", null, ["playerrolecell", "specialrolecell"]);
        const rolep = createHTMLTag("p", `${role}-text`, ["playerroletext"]);
        rolep.textContent = playerNames[i] ? playerNames[i] : role;
        rolecell.appendChild(rolep);
        table.appendChild(rolecell);

        const sentencescell = createHTMLTag("div", null, ["sentencescell"]);

        situation.data[role].forEach((sentence) => {
            const div = createHTMLTag("div", null, ["sentencediv"]);

            div.textContent = `- ${sentence}`;

            const buttonsdiv = createHTMLTag("div", null, ["buttonsdiv"]);
            const chosebutton = createHTMLTag("button", null, ["smallbutton"]);
            chosebutton.textContent = "Csere";
            buttonsdiv.appendChild(chosebutton);

            const randombutton = createHTMLTag("button", null, ["smallbutton"]);
            randombutton.textContent = "Random";
            buttonsdiv.appendChild(randombutton);

            div.appendChild(buttonsdiv);
            sentencescell.appendChild(div);
        })
        table.appendChild(sentencescell);
    });
    infosection.appendChild(table);
}

function display1234() {
    const infosection = document.getElementById("specificsection");
    infosection.innerHTML = "";
    infosection.classList.remove("hideelement");

    const title = createHTMLTag("h3", null,[]);
    title.textContent = "Szavak száma"
    infosection.appendChild(title);

    const container = createHTMLTag("div", "container1234", []);

    const table = createHTMLTag("div", null, ["gridtable"]);
    situation.roles.forEach((role, i) => {

        const rolecell = createHTMLTag("div", null, ["playerrolecell", "wordnumrolecell"]);
        const rolep = createHTMLTag("p", `${role}-text`, ["playerroletext"]);
        rolep.textContent = playerNames[i] ? playerNames[i] : role;
        rolecell.appendChild(rolep);
        table.appendChild(rolecell);

        const wordnums = shuffleWordNums();
        const wordnumcell = createHTMLTag("div", `wordnum-${i+1}`, ["wordnumcell"]);
        wordnumcell.textContent = wordnums[i];
        table.appendChild(wordnumcell);
    });
    container.appendChild(table);

    const button = createHTMLTag("button", "shufflebutton", ["smallbutton"]);
    button.textContent = "Újrasorsolás";
    button.addEventListener("click", () => {
        const wordnums = shuffleWordNums();
        wordnums.forEach((n, i) => {
            const div = document.getElementById(`wordnum-${i+1}`);
            div.textContent = n;
        })
    });
    container.appendChild(button);

    infosection.appendChild(container);
}

function shuffleWordNums() {
    return [1,2,3,4].sort(() => Math.random() - 0.5);
}

//#endregion Situation