document.addEventListener('DOMContentLoaded', async () => { 
    let situations = await getAllSituations();
    displaySituations(situations);
});

function displaySituations(allsituations) {
        
    let [game, situations] = filterSituationsByGame(allsituations);
    console.log(situations);

    const section = document.getElementById("situationlistsection");
    section. innerHTML = "";

    situations.forEach(situation => {
        const div = createHTMLTag("div", `situationlistitem-${situation.id}`, ["card", "situationlistitem"]);

        const topdiv = createHTMLTag("div", null, ["situationlistitem-topdiv"]);
        const variationlabel = createHTMLTag("div", null, ["situationlistitem-variationlabel"]);
        variationlabel.textContent = game ? game : "Alap szituáció";
        topdiv.appendChild(variationlabel);
        
        const playButton = createHTMLTag("button", null, ["cardbutton", "situationlistitem-play-button"])
        playButton.textContent = "Kiválaszt";

        playButton.addEventListener("click", () => {
            console.log(situation);
            setItemInStorage("game", game);
            setItemInStorage("situation", situation);
            window.location = "./situation.html";
        });

        topdiv.appendChild(playButton);

        div.appendChild(topdiv);
        
        const desc = createHTMLTag("p", null, ["situationlistitem-description"]);
        desc.textContent = situation.description;
        div.appendChild(desc);

        const bottomdiv = createHTMLTag("div", null, ["situationlistitem-bottomdiv"]);
        
        const variations = displayVariations(situation, game);
        bottomdiv.appendChild(variations);

        const keywords = displayKeyWords(situation.keywords);
        bottomdiv.appendChild(keywords);
        div.appendChild(bottomdiv);
        
        section.appendChild(div);
    });
}

function displayVariations(situation, selected) {
    const div = createHTMLTag("div", null, ["situationlistitem-variations"]);

    const label = createHTMLTag("div", null, ["situationlistitem-variations-text"]);
    label.textContent = "Változatok: ";
    div.appendChild(label);

    let variations = situation.variations;
    
    if(selected) {
        variations = situation.variations.concat([{game: "Alap szituáció"}]);
    }

    variations.forEach((variation) => {
        if (variation.game != selected) {
            const button = createHTMLTag("button", null, ["situationlistitem-variations-button"]);
            button.textContent = variation.game;
            button.addEventListener("click", () => {
                const game = variation.game == "Alap szituáció" ? null : variation.game;
                refreshSituation(situation, game);
            })
            div.appendChild(button);
        }
    })
    return div;
}

function displayKeyWords(keywords) {
    const div = createHTMLTag("div", null, ["situationlistitem-keywords"]);

    keywords.forEach((keyword) => {
        const label = createHTMLTag("div", null, ["situationlistitem-keywords-label"]);
        label.textContent = keyword;
        div.appendChild(label);
    })

    return div;
}

function refreshSituation(situation, game) {
    const div = document.getElementById(`situationlistitem-${situation.id}`);
    div.innerHTML = "";

    let descText;

    if (game) {
        const gamedata = situation.variations.find((v) => { return v.game == game; });
        descText = [situation.description, gamedata.description].join(" ");
    }
    else {
        descText = situation.description;
    }

    const topdiv = createHTMLTag("div", null, ["situationlistitem-topdiv"]);
    const variationlabel = createHTMLTag("div", null, ["situationlistitem-variationlabel"]);
    variationlabel.textContent = game ? game : "Alap szituáció";
    topdiv.appendChild(variationlabel);

    const playButton = displayPlayOptions(situation, null);
    topdiv.appendChild(playButton);

    div.appendChild(topdiv);

    const desc = createHTMLTag("p", null, ["situationlistitem-description"]);
    desc.textContent = descText;
    div.appendChild(desc);

    const bottomdiv = createHTMLTag("div", null, ["situationlistitem-bottomdiv"]);

    const variations = displayVariations(situation, game);
    bottomdiv.appendChild(variations);

    const keywords = displayKeyWords(situation.keywords);
    bottomdiv.appendChild(keywords);
    div.appendChild(bottomdiv);
}

// function filterSituations() {
//     return filterSituationsByGame();
// }

function filterSituationsByGame(situations) {
    let gameFilter = getItemFromStorage("game");
    let filtered = situations;
    console.log(gameFilter);

    if (gameFilter) {
        
        const gamemenu = document.getElementById("gamemenu");
        gamemenu.textContent = `Játék: ${gameFilter}`;
        
        if (!["Zsebszöveg", "Bekérdező", "Stopptrükk"].includes(gameFilter)) {
            filtered = situations.filter((situation) => {
                return situation.variations.find((v) => {
                    return v.game == gameFilter;
                });
            })
        }
    }

    return [gameFilter, filtered];
}