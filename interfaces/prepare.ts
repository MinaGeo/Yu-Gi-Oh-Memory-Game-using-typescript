import { Card } from "./index";

export interface Prepare {
    cards?: Card[];
    selectedCard_1?: Card;
    selectedCard_2?: Card;
    selectedIndex_1?: number;
    selectedIndex_2?: number;
    progress?: number;
    fullTrack?: HTMLAudioElement;
    flipAudio?: HTMLAudioElement;
    goodAudio?: HTMLAudioElement;
    failAudio?: HTMLAudioElement;
    gameOverAudio?: HTMLAudioElement;

}