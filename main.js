import Timer from "./classes/Timer.js";
import Note from "./classes/Note.js";
import Common from "./classes/common-function/common.js";
import Pallina from "./classes/Pallina.js";
import RequestAnimationControl from "./classes/common-function/request-animation-control.js";
import TimerScheduler from "./classes/TimerScheduler.js";

const worker = new Worker('./workers/eazy-timer.js');

const contextAudio = new (window.AudioContext || window.webkitAudioContext)();
const timer = new Timer(90, [tick], worker);
//const timer = new TimerScheduler(90, [tick],  worker,contextAudio.currentTime);
const anime = new RequestAnimationControl([renderCanvas]);

//crea un canvas e un audio context
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
canvas.style.backgroundColor = '#000';
canvas.style.position = 'relative';
canvas.style.top = '0';
canvas.style.left = '0';
document.body.appendChild(canvas);

//crea un bottone per il tempo
const startButton = Common.createButton('start', () => {
    anime.restore();
    timer.start();
}, document);
const stopButton = Common.createButton('stop', () => {
    anime.pause();
    timer.stop();
}, document);
startButton.style.position = 'relative';
startButton.style.top = '0';
startButton.style.left = '0';
stopButton.style.position = 'relative';
stopButton.style.top = '0';
stopButton.style.left = '0';
document.body.appendChild(startButton);
document.body.appendChild(stopButton);

const contextCanvas = canvas.getContext('2d');
const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1;
let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.
let timerID = 0;
const notesInQueue = []; // array of notes that have been put in, but not yet played.ù    
let tempo = 120.0;

let currentTime = contextAudio.currentTime;
// scrivi UN riff di 8 note in mi minore
const canzone = [
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.4 } },
    { note: 'G2', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } },
    { note: 'G3', envelope: { attack: 0.1, decay: 0.6, sustain: 0.5, release: 0.5 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.4 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.6, sustain: 0.5, release: 0.5 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } }];

const canzone2 = [
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.4 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.3 } },
    { note: 'G2', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.4 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.4 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.6, sustain: 0.5, release: 0.5 } },
    { note: 'G1', envelope: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.1 } }];

let forme = [];
let buffer = null;
const load = () => {
    const request = new XMLHttpRequest();
    request.open("GET", 'assets/wav/grave_snare.wav', true);
    request.responseType = "arraybuffer";
    request.onload = function () {
        let undecodedAudio = request.response;
        console.log(undecodedAudio, 'ces');
        contextAudio.decodeAudioData(undecodedAudio, (data) => buffer = data);
    };
    request.send();
}
load();
function play() {
    const source = contextAudio.createBufferSource();
    source.buffer = buffer;
    //alza il volume
    const gainNode = contextAudio.createGain();
    gainNode.gain.value = 1;
    source.connect(gainNode);
    gainNode.connect(contextAudio.destination);
    source.start();
    source.stop(contextAudio.currentTime + 1);

    //suona una nota corta bassa con un oscillatore
    const oscillator = contextAudio.createOscillator();
    oscillator.frequency.value = Math.random() * 100 + 1001;
    oscillator.type = 'sawtooth';
    const gain = contextAudio.createGain();
    gain.gain.value = 1;
    //usa un riverbero per il volume
    const reverberator = contextAudio.createConvolver();
    const impulse = contextAudio.createBuffer(2, 44100, contextAudio.sampleRate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);
    for (let i = 0; i < impulseL.length; i++) {
        impulseL[i] = Math.random() * 2 - 1;
        impulseR[i] = Math.random() * 7 - 1;
    }
    reverberator.buffer = impulse;
    oscillator.connect(gain);
    gain.connect(reverberator);
    reverberator.connect(contextAudio.destination);
    oscillator.start();
    oscillator.stop(contextAudio.currentTime + 0.2);
}
let bufferKick = null;
const loadKick = () => {
    const requestKick = new XMLHttpRequest();
    requestKick.open("GET", 'assets/wav/kick27.wav', true);
    requestKick.responseType = "arraybuffer";
    requestKick.onload = function () {
        let undecodedAudioKick = requestKick.response;
        console.log(undecodedAudioKick, 'ces');
        contextAudio.decodeAudioData(undecodedAudioKick, (data) => bufferKick = data);
    };
    requestKick.send();
}
loadKick();
function playKick() {
    const sourceKick = contextAudio.createBufferSource();
    sourceKick.buffer = bufferKick;
    //alza il volume
    const gainNode = contextAudio.createGain();
    gainNode.gain.value = 1;
    sourceKick.connect(gainNode);
    gainNode.connect(contextAudio.destination);
    gainNode.gain.setValueAtTime(0.5, contextAudio.currentTime);
    sourceKick.start();
    sourceKick.stop(contextAudio.currentTime + 1);
}

let bufferHat = null;
const loadHat = () => {
    const requestHat = new XMLHttpRequest();
    requestHat.open("GET", 'assets/wav/hitht.wav', true);//assets\wav\HiHat1.wav
    requestHat.responseType = "arraybuffer";
    requestHat.onload = function () {
        let undecodedAudioHat = requestHat.response;
        console.log(undecodedAudioHat, 'ces');
        contextAudio.decodeAudioData(undecodedAudioHat, (data) => bufferHat = data);
    };
    requestHat.send();
}
loadHat();
function playHat() {
    const sourceHat = contextAudio.createBufferSource();
    sourceHat.buffer = bufferHat;
    //alza il volume
    const gainNode = contextAudio.createGain();
    gainNode.gain.value = 1;
    sourceHat.connect(gainNode);
    gainNode.connect(contextAudio.destination);
    sourceHat.start();
    sourceHat.stop(contextAudio.currentTime + 1);
    gainNode.gain.setValueAtTime(0.5, contextAudio.currentTime);
    //suona una nota corta bassa con un oscillatore
    const oscillator = contextAudio.createOscillator();
    oscillator.frequency.value = 110;
    oscillator.type = 'sine';
    const gain = contextAudio.createGain();
    gain.gain.value = 1;
    oscillator.connect(gain);
    gain.connect(contextAudio.destination);
    oscillator.start();
    oscillator.stop(contextAudio.currentTime + 0.2);
}
let counterTick = 0;

/*crea uno slider per il tempo*/
const slider = document.createElement('input');
slider.style.position = 'relative';
slider.type = 'range';
slider.min = '60';
slider.max = '440';
slider.value = '90';
slider.oninput = () => {
    timer.bpm = slider.value;
}
document.body.appendChild(slider);
//crea 1 pallina ogni 4 battute
function createBall(configurazione) {
    const pallina = new Pallina(configurazione, contextCanvas);
    forme.push(pallina);
}

function renderCanvas() {
    contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
    forme.forEach(element => {
        forme.forEach(element2 => {
            if (element !== element2) {
                element.collision(element2);
            }
        });
        element.update();
        element.draw();
    });

    //sposta le scritte in alto a destra     sulla canvas
    contextCanvas.font = '3opx Impact';
    contextCanvas.fillStyle = '#fff';
    contextCanvas.strokeStyle = 'red';
    contextCanvas.fillText(`Tempo: ${timer.bpm}`, canvas.width - 100, canvas.height - 20);
    contextCanvas.strokeText(`Tempo: ${timer.bpm}`, canvas.width - 100, canvas.height - 20);
    contextCanvas.fillText(`Tick: ${counterTick}`, canvas.width - 100, canvas.height - 40);
    contextCanvas.strokeText(`Tick: ${counterTick}`, canvas.width - 100, canvas.height - 40);

    //elimiare le forme che sono fuori dalla canvas
    forme = forme.filter(element => {
        return element.x < canvas.width;
    });

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        notesInQueue.splice(0, 1);   // remove note from queue
    }
}

//crea un bottone per resetare il tempo
const resetButton = Common.createButton('reset', () => {
    counterTick = 0;
    forme = [];
}, document);

resetButton.style.position = 'relative';
resetButton.style.top = '0';
resetButton.style.left = '0';
document.body.appendChild(resetButton);

function tick() {

    if (counterTick % 2 !== 0) {
        playHat();
        const c = {
            x: canvas.width / 2 + 200,
            y: 10,
            radius: 50,
            color: 'white',
            isShowing: true,
            scritta: 'hit!'
        };

        createBall(c);
        const a = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 150,
            color: Common.randomColor(),
            isShowing: true,
            scritta: 'BASS'
        };
        createBall(a);
    }
    if (counterTick % 2 === 0) {
        playKick();
        const c = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: Math.floor(Math.random() * 20) + 100,
            color: Common.randomColor(),
            isShowing: true,
            scritta: 'KICK IT!'
        };

        createBall(c);
    }
    if (counterTick === 2 || counterTick === 6) {

        play();
        const a1 = {
            x: 30,
            y: canvas.height / 2,
            radius: 200,
            color: Common.randomColor(),
            isShowing: true,
            scritta: 'SAWTOOTH',
        };
        createBall(a1);
        const c = {
            x: 100 * counterTick,
            y: 100,
            radius: counterTick % 5 === 0 ? 50 : 100,
            color: 'red',
            isShowing: true,
            scritta: 'SNARE!'
        };
        createBall(c);
    }

    if (counterTick === 15) {
        counterTick = 0;
    } else {
        counterTick++;
    }

}

anime.animazione();
