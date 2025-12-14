import { getAllGames, createHTMLTag, generateRandomNumber, setItemInStorage } from './main.js';

document.addEventListener('DOMContentLoaded', async () => { 
    await displayGameCards(true);
    setItemInStorage("game", null);
});

async function displayGameCards() {
    const games = await getAllGames();
    const section = document.getElementById("gamecardssection");
    games.sort((a,b) => {
        if(a.id < b.id) { return -1; }
        else { return 1; }
    });

    games.forEach(game => {
        const card = displayGameCard(game);
        section.appendChild(card);
    });

    const random = { 
        name: "Random játék",
        description: "Ha nem tudtok dönteni, hogy melyik játékot játsszátok, ezt az opciót választva kisorsolhattok egyet random."
    }

    const randomcard = displayGameCard(random, games);
    randomcard.classList.add("randomcard");
    section.appendChild(randomcard);

    showRandomDialog(games);
}

function displayGameCard(game) {
    const card = createHTMLTag("div", null, ["card", "gamecard"]);
    const link = createHTMLTag("a", null, []);
    if(game.name != "Random játék") {
        const url = new URL('../pages/situations.html', import.meta.url);
        link.href = url;
    }
    const cardcontent = createHTMLTag("div", null, ["cardcontent", "gamecard-content"]);

    const name = createHTMLTag("h2", null, ["cardname"]);
    name.textContent = game.name;
    cardcontent.appendChild(name);

    const descdiv = createHTMLTag("div", null, ["gamecard-description-container"]);
    const desc = createHTMLTag("p", null, []);
    desc.textContent = game.description;
    descdiv.appendChild(desc);
    cardcontent.appendChild(descdiv);

    link.addEventListener("click", () => {
        if(game.name == "Random játék") {
            const dialog = document.getElementById("dialog");
            dialog.show();
        }
        else {
            setItemInStorage("game", game.name);
        }      
    })

    link.appendChild(cardcontent);
    card.appendChild(link);

    return card;
}

function showRandomDialog(games) {
    const dialog = document.getElementById("dialog");
    dialog.innerHTML = "";

    const text = createHTMLTag("p", null, []);
    text.textContent = "A kisorsolt játék:";
    dialog.appendChild(text);

    const name = createHTMLTag("h2", null, ["cardname"]);
    const num = generateRandomNumber(games.length);
    name.textContent = games[num].name;
    dialog.appendChild(name);
    
    const buttonsdiv = createHTMLTag("div", "dialogbuttonsdiv", []);

    const backbutton = createHTMLTag("button", "backbutton", ["mainbutton"]);
    backbutton.textContent = "Mégse";
    backbutton.addEventListener("click", () => {dialog.close();});

    const generatebutton = createHTMLTag("button", "generatebutton", ["mainbutton"]);
    generatebutton.textContent = "Új sorsolás";
    generatebutton.addEventListener("click", () => {showRandomDialog(games);});

    const playbutton = createHTMLTag("button", "playbutton", ["mainbutton"]);
    playbutton.textContent = "Játék";
    playbutton.addEventListener("click", () => {
        setItemInStorage("game", games[num].name);
        dialog.close();
        const url = new URL('../pages/situations.html', import.meta.url);
        window.location = url;
    });

    buttonsdiv.appendChild(backbutton);
    buttonsdiv.appendChild(generatebutton);
    buttonsdiv.appendChild(playbutton);
    dialog.appendChild(buttonsdiv);
}