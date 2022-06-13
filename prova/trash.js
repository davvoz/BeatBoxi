import { Timer } from './classes/Timer.js';
import { Note } from './classes/Note.js';
import { FormaStellaSei } from './classes/Forma.js';
/* crea un canva e un context   */
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
canvas.style.backgroundColor = '#000';
canvas.style.position = 'relative';
canvas.style.top = '30px';
canvas.style.left = '30px';
document.body.appendChild(canvas);
/*audio context*/
const contextAudio = new AudioContext();
const contextCanvas = canvas.getContext('2d');
let counterTick = 0;
let counterScala = 0;
const worker = new Worker('./workers/timer.js');
const timer = new Timer(90, [sequenza], worker);
const forme = [];
const timeContros = createTimerControls();
timeContros.style.position = 'relative';
timeContros.style.top = '0';
timeContros.style.left = '0';
document.body.appendChild(timeContros);

/* crea trigger sulla tastiera*/
document.addEventListener('keydown', (e) => {
    let note = new Note(e.keyCode, 'square', contextAudio.destination, contextAudio);
    note.oscillator.setEnvelope({
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.5
    });
    new FormaStellaSei(canvas.width / 2, canvas.height / 2, e.keyCode * 2, 'red', contextCanvas).draw();
    note.play();
});

/* crea uno slider per il tempo*/
let slider = document.createElement('input');
slider.style.position = 'relative';
slider.type = 'range';
slider.min = '60';
slider.max = '240';
slider.value = '90';
slider.oninput = () => {
    timer.bpm = slider.value;
}
document.body.appendChild(slider);


function createButton(text, callback,documentIn) {
    let button = documentIn.createElement('button');
    button.innerText = text;
    button.onclick = callback;
    return button;
}

function sequenza() {
    const numero = Math.floor(Math.random() * 10 + 100);
    const saw = new Note(numero, 'sawtooth', contextAudio.destination, contextAudio);
    saw.oscillator.setEnvelope({
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.7
    });
    saw.play();
    if (counterTick === 0) {
        const noise = new Note(100, 'sine', contextAudio.destination, contextAudio);
        noise.oscillator.setEnvelope({
            attack: 0.9,
            decay: 0.1,
            sustain: 0.2,
            release: 1.5
        });

        noise.play();
        disegnaStellaSei(12, 200, 200, 'white', contextCanvas);
    }
    if (counterScala === 7) {
        const noise2 = new Note(80, 'sawtooth', contextAudio.destination, contextAudio);
        noise2.oscillator.setEnvelope({
            attack: 0.9,
            decay: 0.1,
            sustain: 0.2,
            release: 2.5
        });
        noise2.play();
        forme.push(disegnaStellaSei(80, numero, numero, 'red', contextCanvas));
    }
    if (counterScala === 1) {
        const sq = new Note(120, 'square', contextAudio.destination, contextAudio);
        sq.oscillator.setEnvelope({
            attack: 1.9,
            decay: 1.1,
            sustain: 0.1,
            release: 2.5
        });
        sq.play();
        forme.push(disegnaStellaSei(120, numero, numero, 'red', contextCanvas));
    }

    if (counterTick === 3) {
        counterTick = 0;
    } else {
        counterTick++;
    }
    if (counterScala < 15) {
        counterScala++;
    } else {
        counterScala = 0;
    }
}

function createTimerControls() {
    let controls = document.createElement('div');
    controls.appendChild(createButton('start', () => {
        timer.start();
        slider.disabled = true;
    }));
    controls.appendChild(createButton('stop', () => {
        timer.stop();
        slider.disabled = false;
    }));
    return controls;
}

/*disegna una FormaStellaSei parametrica*/
function disegnaStellaSei(x, y, r, color, context) {
    let forma = new FormaStellaSei(x, y, r, color, context);
    forma.draw();
    return forma;
}
