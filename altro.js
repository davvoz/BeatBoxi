import { Common, Button } from "./classes/common-function/common.js";
import TimerScheduler from "./classes/TimerScheduler.js";

document.body.style.overflow = 'hidden';
document.body.style.margin = '0';
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;
//mettila al centro
canvas.style.position = 'absolute';
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.marginLeft = '-' + canvas.width / 2 + 'px';
canvas.style.marginTop = '-' + canvas.height / 2 + 'px';
canvas.style.border = '1px solid black';
//crea un audiocontext
const audioCtx = new AudioContext();

//crea una funzione per caricareil kick e suonaro in un sampler più tardi

const audioBufferKick = await fetch(new URL('./assets/wav/kick27.wav', import.meta.url))
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

const audioBufferSnare = await fetch(new URL('./assets/wav/grave_snare.wav', import.meta.url))
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

const audioBufferhitht = await fetch(new URL('./assets/wav/hitht.wav', import.meta.url))//assets\wav\hitht.wav
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

  //load this C:\Users\Compiuter\Desktop\prova\assets\wav\dark_voice_08.wav
  const audioBufferVox = await fetch(new URL('./assets/wav/dark_voice_08.wav', import.meta.url))
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));


const mainBass = audioCtx.createOscillator();


let maxLength = 32;
mainBass.type = 'sawtooth';
mainBass.frequency.value = 60;
//alza il volume del mainBass
const gainNode = audioCtx.createGain();

gainNode.gain.value = 0.5;
mainBass.connect(gainNode);
gainNode.connect(audioCtx.destination);
mainBass.start();

const mainPad = audioCtx.createOscillator();
mainPad.type = 'sawtooth';
mainPad.frequency.value = 280;
//gain
const gainNodePad = audioCtx.createGain();
gainNodePad.gain.value = 0.5;
//reverb
const convolver = audioCtx.createConvolver();
//cerca convolver online

convolver.buffer = await fetch(new URL('./assets/wav/reverbo.wav', import.meta.url))//C:\Users\Compiuter\Desktop\prova\assets\wav\reverbo.wav
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));
//connect
gainNodePad.gain.value = 0.3;
convolver.addEventListener  ('ended', () => {
  console.log('ended');
} , false);
mainPad.addEventListener('start', () => {
  console.log('start');
} , false);
mainPad.connect(gainNodePad);
gainNodePad.connect(convolver);
convolver.connect(audioCtx.destination);
mainPad.start();



document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, canvas.width, canvas.height);
//load assets\wav\kick27.wav

const timerWorker = new Worker('./workers/eazy-timer.js');
var u = 0;
//const timer = new Timer(190, [tick], timerWorker, audioCtx);
const timerScheduler = new TimerScheduler(120, [tick], audioCtx);


let sfondo = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  color: '#000',
  borderColor: '#000',
  borderWidth: 1
}

let configPlayButton = {
  //posizionalo in alto a destra
  x: canvas.width - 10 - 100,
  y: 0 + 10,
  width: 100,
  height: 100,
  text: 'Play\nthis\nshit',
  toggleText: 'Pause\nthisshit',
  color: '#af0',
  toggleColor: '#0fa',
  font: 'Arial',
  fontSize: '30',
  fontColor: '#0f0',
  toggleFontColor: '#0f0',
  borderColor: '#00f',
  toggleBorderColor: '#2fa',
  borderWidth: 2,
  toggleBorderWidth: 2
}
let isStarted = false;

const buttonPlay = new Button(configPlayButton, ctx, () => {
  if (isStarted) {
    timerScheduler.handleStop();
    isStarted = false;
  } else {
    timerScheduler.handlePlay();
    isStarted = true;
  }
}, true);
buttonPlay.draw();
//crea un controllo per il tempo input
let configTimer = {
  //posizionalo in alto a destra alla sinistra del play button
  x: canvas.width - 220,
  y: 0 + 10,
  width: 100,
  height: 100,
  text: 'Aggiusta\nquando\nsi rompe',
  color: '#f0a',
  font: 'Arial',
  fontSize: '20',
  fontColor: '#000',
  borderColor: '#00f',
  borderWidth: 2
};

const buttonTimer = new Button(configTimer, ctx, () => {
  //resetto il timer
  u = 0;
  //azzero i volumi
  gainNode.gain.value = 0;
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNodePad.gain.value = 0;
  gainNodePad.gain.setValueAtTime(0, audioCtx.currentTime);


}, false);



let kickTrack = returnEmptyTrack();
let snareTrack = returnEmptyTrack();
let hithtTrack = returnEmptyTrack();
let bassTrack = returnEmptyTrack();
let padTrack = returnEmptyTrack();
let voxTrack = returnEmptyTrack();
//crea per ogni track un array di oggetti renderizzabili bottoni
let oggettiRenderizzabili = [buttonTimer, buttonPlay];
pushaBottoni(kickTrack, 0);
pushaBottoni(snareTrack, 1);
pushaBottoni(hithtTrack, 2);
pushaBottoni(bassTrack, 3);
pushaBottoni(padTrack, 4);
pushaBottoni(voxTrack, 5);

renderCanvas();

//array di frequenze armoniche
let freqArmoniche =  [161.6, 93.7, 129.6, 149.2, 92.0, 140.0, 93.9, 123.2] ;//WTF!!! bella musica
let counterFreqArmoniche = 0;
function returnEmptyTrack() {
  let emptyTrack = [];
  for (let i = 0; i < maxLength; i++) {
    emptyTrack.push('0');
  }
  return emptyTrack;
}


function pushaBottoni(track, position) {
  for (let i = 0; i < track.length; i++) {
    let configBottoni = {
      //posizionali in 1 righe e 32 colonne in modo da occupare n righe , sono alti 30 px e una riga è lunga quanto la larghezza del canvas
      x: i * 32 + 200,
      y: position * 32 + 200,
      width: 32,
      height: 32,
      color: track[i] === 'x' ? '#f00' : '#0f0',
      borderColor: track[i] === 'x' ? '#f00' : '#000',
      borderWidth: 2,
      text: track[i],
      font: 'Arial',
      fontSize: '10',
      fontColor: track[i] === 'x' ? '#fff' : '#000',
      toggleText: track[i] === 'x' ? '0' : 'x',
      toggleColor: track[i] === 'x' ? '#000' : '#fff',
      toggleFontColor: track[i] === 'x' ? '#000' : '#fff',
      toggleBorderColor: track[i] === 'x' ? '#000' : '#fff',
      toggleBorderWidth: 2,
      hoverColor: '#f00',
    }
    let bottone = new Button(configBottoni, ctx, () => {
      if (track[i] === 'x') {
        track[i] = '0';
      } else {
        track[i] = 'x';
      }

    }, true);
    oggettiRenderizzabili.push(bottone);
  }
}

function tick() {
  //gainNode.gain.setValueAtTime(0, 0);
  gainNodePad.gain.setValueAtTime(0, timerScheduler.contextPlayTime);
  if (kickTrack[timerScheduler.rhythmIndex] === 'x') {
    playSound(audioBufferKick);
  }
  if (snareTrack[timerScheduler.rhythmIndex] === 'x') {
    playSound(audioBufferSnare);
  }
  if (hithtTrack[timerScheduler.rhythmIndex] === 'x') {
    playSound(audioBufferhitht);
  }
  if (voxTrack[timerScheduler.rhythmIndex] === 'x') {
    playSound(audioBufferVox);
  }

  if (bassTrack[timerScheduler.rhythmIndex] === 'x') {
    gainNode.gain.setValueAtTime(0.2, 0);
    //vai a zero in un quarto di secondo con una curva
    gainNode.gain.setValueAtTime(0, timerScheduler.contextPlayTime + 0.65);

 //   mainBass.frequency.setValueAtTime(freqArmoniche[counterFreqArmoniche]* 0.5, 0);
    //effetto legato
    mainBass.frequency.linearRampToValueAtTime(freqArmoniche[counterFreqArmoniche] * 0.5, timerScheduler.contextPlayTime + 0.35);
  }
  if (padTrack[timerScheduler.rhythmIndex] === 'x') {
    const randomNote = freqArmoniche[Math.floor(Math.random() * freqArmoniche.length)];
    gainNodePad.gain.setValueAtTime(0.5, timerScheduler.contextPlayTime);
    //SUONA UNA NOTA CASUALE DELLA LISTA FREQARMONICHE
    //alza di 2 ottava la frequenza della nota
    mainPad.frequency.setValueAtTime(randomNote * 4, timerScheduler.contextPlayTime);
  }

  if(counterFreqArmoniche === freqArmoniche.length-1) {
    counterFreqArmoniche = 0;
  } else {
    counterFreqArmoniche++;
  }

  renderCanvas();
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Common.drawRect(sfondo, ctx);
  renderizzaOggetti();
//inventa un titolo simpatico ed enorme , che spieghi cosa fa la app e scrivilo in alto a sinistra

  ctx.font = '30px Arial';
  ctx.fillStyle = '#fa0';
  ctx.fillText('BeatBox', 10, 30);
  ctx.fillText('by: @davvoz', 10, 60);
  ctx.fillText('github:https://github.com/davvoz', 10, 90);

  
  //disegna una linea verticale per indicare il tempo
  ctx.fillRect(0, canvas.height - 20, canvas.width, 1);
  //disegna una linea orizzontale per indicare il tempo
  ctx.fillRect(u * (canvas.width / maxLength), canvas.height - 20, 1, 20);
  //scrivi il tempo seguendo la linea verticale
  ctx.fillStyle = 'white';
  ctx.fillRect(timerScheduler.rhythmIndex * (canvas.width / maxLength), canvas.height - 20, canvas.width - timerScheduler.rhythmIndex * (canvas.width / maxLength), 20);

}
function playSound(buffer) {
  // creates a sound source from buffer just loaded
  var source = audioCtx.createBufferSource();
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(audioCtx.destination);       // connect source to context's destination (the speakers)
  source.start(0);                           // play the source now
}
function renderizzaOggetti() {
  oggettiRenderizzabili.forEach(function (oggetto) {
    oggetto.draw();
  });
}
function playSoundReverb(buffer) {
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(convolver);
  convolver.connect(audioCtx.destination);
  source.start();
}

//listener per il click sul canvas
canvas.addEventListener('click', function (e) {
  //controlla se sei dentro il bottone play
  oggettiRenderizzabili.forEach(function (oggetto) {
    if (oggetto.isInside(e.offsetX, e.offsetY)) {
      oggetto.click();
    }
  });
}, false);

//listener per l hover sul canvas
// canvas.addEventListener('mousemove', function (e) {
//   //controlla se sei dentro il bottone play
//   oggettiRenderizzabili.forEach(function (oggetto) {
//     if (oggetto.isInside(e.offsetX, e.offsetY)) {
//       oggetto.hover();
//     } else {
//       canvas.style.cursor = 'default';
//       oggetto.unhover();
//     }
//   });

// }, false);
