const prepare = {
    cards: [],
    progress: 0,
    fullTrack: new Audio('./assets/audio/fulltrack.mp3'),
    flipAudio: new Audio('./assets/audio/flip.mp3'),
    goodAudio: new Audio('./assets/audio/good.mp3'),
    failAudio: new Audio('./assets/audio/fail.mp3'),
    gameOverAudio: new Audio('./assets/audio/game-over.mp3')
};
prepare.fullTrack.loop = true;
const numberOfCards = 20;
const tempNumbers = [];
let cardsHtmlContent = '';
let isChecking = false; // Flag to prevent multiple rapid clicks
const getRandomInt = (min, max) => {
    let result;
    let exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumbers.find(number => number === result.toString())) {
            exists = false;
            tempNumbers.push(result.toString());
        }
    }
    return result;
};
const toggleFlip = (index) => {
    if (isChecking)
        return; // Prevent actions if checking is in progress
    prepare.fullTrack.play();
    const card = prepare.cards[index];
    if (!card.flip && card.clickable) {
        flip(card, index);
        selectCard(card, index);
    }
};
const flip = (card, index) => {
    prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        document.getElementById(`card-flip-${index}`).classList.toggle('flip');
    }
};
const selectCard = (card, index) => {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }
    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        isChecking = true; // Set flag to true to prevent further clicks
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clickable = false;
            prepare.selectedCard_2.clickable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();
            isChecking = false; // Reset flag
        }
        else {
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;
                isChecking = false; // Reset flag
            }, 1000);
        }
    }
};
const changeProgress = () => {
    const progress = (prepare.cards.filter(card => !card.clickable).length / numberOfCards) * 100;
    const progressElement = document.getElementById('progress');
    progressElement.style.width = `${progress}%`;
    progressElement.innerText = `${Math.round(progress)}%`;
};
const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clickable).length === numberOfCards) {
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.failAudio);
        stopAudio(prepare.goodAudio);
        prepare.gameOverAudio.play();
        showWinMessage(); // Show the win message
    }
};
const showWinMessage = () => {
    const winMessageElement = document.getElementById('winMessage');
    if (winMessageElement) {
        winMessageElement.style.display = 'block'; // Show the win message
    }
};
const stopAudio = (audio) => {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
};
for (let index = 0; index < numberOfCards / 2; index++) {
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}.png`,
        flip: '',
        clickable: true,
        index
    });
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}.png`,
        flip: '',
        clickable: true,
        index
    });
}
prepare.cards.sort((a, b) => (a.id > b.id ? 1 : -1));
prepare.cards.forEach((item, index) => {
    cardsHtmlContent += `
    <span class="col-sm-4 col-lg-3">
        <!-- Card Flip -->
        <div onclick="toggleFlip(${index})" class="card-flip" id="card-flip-${index}">
            <div class="front">
                <!-- front content -->
                <div class="card">
                    <img class="card-image" src="./assets/back.png">
                </div>
            </div>
            <div class="back">
                <!-- back content -->
                <div class="card">
                    <img src="./assets/images/${item.index}.png" data-holder-rendered="true" style="height: 120px; width: 100%; display: block;">
                </div>
            </div>
        </div>
    </span>
    `;
});
document.getElementById('cards').innerHTML = cardsHtmlContent;
// Add buttons for reset and mute functionality
const buttonsHtmlContent = `
    <div class="control-buttons">
        <div id="resetButton" class="control-button" onclick="resetGame()">
            <i class="fas fa-redo"></i>
        </div>
        <div id="muteButton" class="control-button" onclick="toggleMute()">
            <i class="fas fa-volume-mute"></i>
        </div>
    </div>
`;
document.getElementById('content').insertAdjacentHTML('beforeend', buttonsHtmlContent);
const resetGame = () => {
    location.reload(); // Simple page reload to reset the game
};
const toggleMute = () => {
    prepare.fullTrack.muted = !prepare.fullTrack.muted;
    const muteButtonIcon = document.getElementById('muteButton').children[0];
    if (prepare.fullTrack.muted) {
        muteButtonIcon.classList.remove('fa-volume-up');
        muteButtonIcon.classList.add('fa-volume-mute');
    }
    else {
        muteButtonIcon.classList.remove('fa-volume-mute');
        muteButtonIcon.classList.add('fa-volume-up');
    }
};
