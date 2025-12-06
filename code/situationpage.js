document.addEventListener('DOMContentLoaded', async () => { 
    getDataFromStorage();
});

function getDataFromStorage() {
    let game = getItemFromStorage("game");
    let situation = getItemFromStorage("situation");

    console.log(game);
    console.log(situation);
}