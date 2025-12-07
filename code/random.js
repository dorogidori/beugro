import {getAllSentences, setItemInStorage, generateDifferentNumber} from './main.js';

document.addEventListener('DOMContentLoaded', async () => { 
    let sentences = await getAllSentences();
    setItemInStorage("numbers", []);
    changeSentence(sentences);

    let randommain = document.getElementById("randommain");
    let randomsection = document.getElementById("randomsection");

    randommain.style.height = `${window.innerHeight - 30}px`;
    randommain.style.width = `${window.innerWidth}px`;
    randomsection.style.height = `${window.innerHeight - 70}px`;
    randomsection.addEventListener("click", () => {
        changeSentence(sentences);
    })
});


function changeSentence(sentences) {
    let randomtext = document.getElementById("randomtext");
    let n = generateDifferentNumber(sentences.length);
    randomtext.textContent = sentences[n];
}