import {getAllSentences, setItemInStorage, generateDifferentNumber} from './main.js';

document.addEventListener('DOMContentLoaded', async () => { 
    
    let bellimg = document.getElementById("bellimg");

    bellimg.addEventListener("click", (event) => {
        let image = event.target;
        let sound = document.getElementById("sound");
        sound.play();
        image.src = "../images/ring-pushed.png";
        setTimeout(() => {
            image.src = "../images/ring-unpushed.png";
        }, 2000);
    })
});