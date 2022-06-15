import { Common, Button, RadioButton } from "./classes/common-function/common.js";
import TimerScheduler from "./classes/TimerScheduler.js";

document.body.style.overflow = 'hidden';
document.body.style.margin = '0';
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;
canvas.style.position = 'absolute';
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.marginLeft = '-' + canvas.width / 2 + 'px';
canvas.style.marginTop = '-' + canvas.height / 2 + 'px';
canvas.style.border = '1px solid black';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const audioCtx = new AudioContext();

const audioBufferKick = await fetch(new URL('./assets/wav/kick27.wav', import.meta.url))
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

const audioBufferSnare = await fetch(new URL('./assets/wav/grave_snare.wav', import.meta.url))
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

const audioBufferhitht = await fetch(new URL('./assets/wav/hitht.wav', import.meta.url))//assets\wav\hitht.wav
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

const audioBufferVox = await fetch(new URL('./assets/wav/dark_voice_08.wav', import.meta.url))
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));

const mainBass = audioCtx.createOscillator();

const maxLength = 32;
mainBass.type = 'sawtooth';
mainBass.frequency.value = 60;
const gainNodeOscMainBass = audioCtx.createGain();
gainNodeOscMainBass.gain.value = 1;

const filterMainBass = audioCtx.createBiquadFilter();
filterMainBass.type = 'lowpass';
filterMainBass.frequency.value = 1000;
filterMainBass.Q.value = 1;

const gainNodeMainBass = audioCtx.createGain();
gainNodeMainBass.gain.value = 2;
mainBass.connect(gainNodeOscMainBass);
gainNodeOscMainBass.connect(filterMainBass);
filterMainBass.connect(gainNodeMainBass);
gainNodeMainBass.connect(audioCtx.destination);

mainBass.start();

const mainPad = audioCtx.createOscillator();
mainPad.type = 'sawtooth';
mainPad.frequency.value = 280;
const gainNodePad = audioCtx.createGain();
gainNodePad.gain.value = 0.5;
const convolver = audioCtx.createConvolver();

convolver.buffer = await fetch(new URL('./assets/wav/reverbo.wav', import.meta.url))//C:\Users\Compiuter\Desktop\prova\assets\wav\reverbo.wav
  .then(res => res.arrayBuffer())
  .then(ArrayBuffer => audioCtx.decodeAudioData(ArrayBuffer));
gainNodePad.gain.value = 0.3;

const midEnhancer = audioCtx.createBiquadFilter();
midEnhancer.type = 'highpass';
midEnhancer.frequency.value = 1000;
midEnhancer.Q.value = 0.9;

const autopanner = audioCtx.createPanner();
const oscPanner = audioCtx.createOscillator();
oscPanner.type = 'square';

const gainNodeOscPanner = audioCtx.createGain();
gainNodeOscPanner.gain.value = 1;
oscPanner.connect(gainNodeOscPanner);
gainNodeOscPanner.connect(autopanner.positionX);
mainPad.connect(midEnhancer);
midEnhancer.connect(gainNodePad);
gainNodePad.connect(convolver);
convolver.connect(autopanner);
autopanner.connect(audioCtx.destination);
oscPanner.start();
mainPad.start();

const timerScheduler = new TimerScheduler(360, [tick], audioCtx);
const sfondo = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  color: '#000',
  borderColor: '#000',
  borderWidth: 1
}
let bottoneSelezionato = 0;
//let counterFreqArmoniche = 0;
let isStarted = false;
let configPlayButton, configTimer, configHoldBass;
inizializaConfigurazioneBottoni();
let buttonPlay, buttonTimer, buttonHoldBass;
inizializzaButtons();
let kickTrack, snareTrack, hithtTrack, bassTrack, padTrack, voxTrack;
inzializzaSamplersTraks();
let scala1, scala2, scala3; inizializzaScale();
let frequenzeScelte = scala1;
let scala1RadioConfig, scala2RadioConfig, scala3RadioConfig;
inizializzaConfigurazioneRadios();
let scala1Radio, scala2Radio, scala3Radio;
inizializzaRadios();

buttonPlay.draw();
scala1Radio.attivato = true;
const radioGroupScala = [scala1Radio, scala2Radio, scala3Radio];
let oggettiRenderizzabili = [buttonTimer, buttonPlay, buttonHoldBass, radioGroupScala[0], radioGroupScala[1], radioGroupScala[2]];
pushaBottoni(kickTrack, 0);
pushaBottoni(snareTrack, 1);
pushaBottoni(hithtTrack, 2);
pushaBottoni(bassTrack, 3);
pushaBottoni(padTrack, 4);
pushaBottoni(voxTrack, 5);

let holdMainBass = false;
renderCanvas();

function inizializzaRadios() {
  scala1Radio = new RadioButton(scala1RadioConfig, ctx, () => {
    callbackRadioButton(scala1, 0);
  });

  scala2Radio = new RadioButton(scala2RadioConfig, ctx, () => {
    callbackRadioButton(scala2, 1);
  });

  scala3Radio = new RadioButton(scala3RadioConfig, ctx, () => {
    callbackRadioButton(scala3, 2);
  });
  return { scala1Radio, scala2Radio, scala3Radio };
}

function inizializzaButtons() {
  buttonPlay = new Button(configPlayButton, ctx, () => {
    if (isStarted) {
      timerScheduler.handleStop();
      isStarted = false;
    } else {
      isStarted = true;
      timerScheduler.handlePlay();
    }
  }, true);

  buttonTimer = new Button(configTimer, ctx, () => {
    gainNodeOscMainBass.gain.value = 0;
    gainNodeOscMainBass.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNodePad.gain.value = 0;
    gainNodePad.gain.setValueAtTime(0, audioCtx.currentTime);
  }, false);

  buttonHoldBass = new Button(configHoldBass, ctx, () => {
    holdMainBass = !holdMainBass;
  }, true);

  return { buttonPlay, buttonTimer, buttonHoldBass };
}

function inzializzaSamplersTraks() {
  kickTrack = returnEmptyTrack();
  snareTrack = returnEmptyTrack();
  hithtTrack = returnEmptyTrack();
  bassTrack = returnEmptyTrack();
  padTrack = returnEmptyTrack();
  voxTrack = returnEmptyTrack();
  return { kickTrack, snareTrack, hithtTrack, bassTrack, padTrack, voxTrack };
}

function inizializzaScale() {
  scala1 = spostaRandomicamenteGliElementiDiUnArray([
    161.6,
    93.7,
    129.6,
    149.2,
    92.0,
    140.0,
    93.9,
    123.2
  ]);
  //scrivi le frequenze per una scala Mi♭ - Sol♭ - La♭ - La - Si♭ - Re♭ - Mi♭
  scala2 = spostaRandomicamenteGliElementiDiUnArray([
    110.0,
    146.8,
    164.8,
    174.6,
    164.8,
    174.6,
    146.8,
    164.8]);
  //converti in frequenze queste  note
  //do         re           mib           fa             sol           lab              si♭
  scala3 = spostaRandomicamenteGliElementiDiUnArray([
    130.813,
    138.591,
    146.832,
    155.563,
    164.814,
    174.614,
    184.997,
    195.998]);
  return { scala1, scala2, scala3 };
}

function inizializaConfigurazioneBottoni() {
  configPlayButton = {
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
    borderWidth: 1,
    toggleBorderWidth: 1
  };
  configTimer = {
    x: canvas.width - 10 - 200,
    y: 0 + 10,
    width: 100,
    height: 100,
    text: 'Shot\nup',
    color: '#f0a',
    font: 'Arial',
    fontSize: '30',
    fontColor: '#000',
    borderColor: '#00f',
    borderWidth: 1
  };
  configHoldBass = {
    x: canvas.width - 10 - 300,
    y: 0 + 10,
    width: 100,
    height: 100,
    text: 'Hold\nBass',
    color: '#af0',
    font: 'Arial',
    fontSize: '30',
    fontColor: '#0f0',
    borderColor: '#00f',
    borderWidth: 1,
    toggleColor: '#0fa',
    toggleBorderColor: '#2fa',
    toggleBorderWidth: 1,
    toggleText: 'Note\nBass'
  }

  return { configPlayButton, configTimer, configHoldBass };
}

function inizializzaConfigurazioneRadios() {
  scala1RadioConfig = {
    x: canvas.width - 10 - 300,
    y: 0 + 10 + 100,
    width: 100,
    height: 100,
    borderWidth: 2,
    fontSize: '20',
    text: 'Scala 1'
  };

  scala2RadioConfig = {
    x: canvas.width - 10 - 200,
    y: 0 + 10 + 100,
    width: 100,
    height: 100,
    borderWidth: 2,
    fontSize: '20',
    text: 'Scala 2'
  };

  scala3RadioConfig = {
    x: canvas.width - 10 - 100,
    y: 0 + 10 + 100,
    width: 100,
    height: 100,
    borderWidth: 2,
    fontSize: '20',
    text: 'Scala 3'
  };
  return { scala1RadioConfig, scala2RadioConfig, scala3RadioConfig };
}

function callbackRadioButton(scala, indice) {
  if (scala.attivato) {
    return;
  }
  //disattiva il bottone vecchio
  radioGroupScala[bottoneSelezionato].attivato = false;
  //attiva il nuovo bottone
  radioGroupScala[indice].attivato = true;
  bottoneSelezionato = indice;
  frequenzeScelte = scala;
  renderCanvas();
}


function returnEmptyTrack() {
  let emptyTrack = [];
  for (let i = 0; i < maxLength; i++) {
    emptyTrack.push('0');
  }
  return emptyTrack;
}

function pushaBottoni(track, position) {
  for (let i = 0; i < track.length; i++) {
    let configBottoni = pulsantiera(i, position, track)
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

function pulsantiera(i, position, track) {
  let altezzaPulsante = canvas.height / maxLength;
  return {
    x: i * (canvas.width / maxLength),
    y: altezzaPulsante + (position * altezzaPulsante) + canvas.height * 0.755,
    width: canvas.width / maxLength,
    height: altezzaPulsante,
    color: track[i] === 'x' ? '#f00' : '#0f0',
    borderColor: track[i] === 'x' ? '#f00' : '#000',
    borderWidth: 1,
    text: track[i],
    font: 'Arial',
    fontSize: '10',
    fontColor: track[i] === 'x' ? '#fff' : '#000',
    toggleText: track[i] === 'x' ? '0' : 'x',
    toggleColor: track[i] === 'x' ? '#000' : '#fff',
    toggleFontColor: track[i] === 'x' ? '#000' : '#fff',
    toggleBorderColor: track[i] === 'x' ? '#000' : '#fff',
    toggleBorderWidth: 1,
    hoverColor: '#f00',
  };
}

function tick() {
  if (isStarted) {
    gainNodeOscPanner.gain.value = 1;
    oscPanner.frequency.value = timerScheduler.bpm / 120 * 0.5;

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
      gainNodeOscMainBass.gain.value = 0.1;
      filterMainBass.frequency.setValueAtTime(3000, 0);
      if (!holdMainBass) {
        let tempoStep = 60 / (timerScheduler.bpm * 4);
        filterMainBass.frequency.setValueAtTime(0, tempoStep + timerScheduler.contextPlayTime);
      }
      mainBass.frequency.setValueAtTime(frequenzeScelte[timerScheduler.rhythmIndex] * 0.5, 0);
    }
    if (padTrack[timerScheduler.rhythmIndex] === 'x') {
      gainNodePad.gain.value = 1;
      gainNodePad.gain.setValueAtTime(0, timerScheduler.contextPlayTime);
      mainPad.frequency.setValueAtTime(frequenzeScelte[timerScheduler.rhythmIndex] * 0.5, timerScheduler.contextPlayTime);
    }
  }
  renderCanvas();
}


function spostaRandomicamenteGliElementiDiUnArray(array) {
  const newArray = [];
  //il nuovo array deve essere lungo 32
  for (let i = 0; i < maxLength / 2; i++) {
    let indice = Math.floor(Math.random() * array.length);
    newArray.push(array[indice]);
  }
  return newArray.concat(newArray);
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Common.drawRect(sfondo, ctx);
  renderizzaOggetti();
  ctx.font = '50px Arial';
  ctx.fillStyle = '#fa0';
  ctx.fillText('BeatBox', 10, 50);
  ctx.fillStyle = 'white';
  ctx.fillRect(timerScheduler.rhythmIndex * (canvas.width / maxLength), canvas.height - 20, canvas.width - timerScheduler.rhythmIndex * (canvas.width / maxLength), 20);
  //scrivi il numero di  battute

  ctx.fillRect(timerScheduler.rhythmIndex * (canvas.width / maxLength) + 10, canvas.height - 100, 20, 100);
  //scrivi al centro enorme  counterFreqArmoniche

  //scrivi frequenzeScelte[counterFreqArmoniche]
  ctx.fillText(frequenzeScelte[timerScheduler.rhythmIndex], canvas.width / 2, canvas.height / 2 + 100);
  //scrivi counterFreqArmoniche
  ctx.fillText(timerScheduler.rhythmIndex, canvas.width / 2, canvas.height / 2 + 150);
  //isStarted
  ctx.fillText(isStarted, canvas.width / 2, canvas.height / 2 + 200);

}
function playSound(buffer) {
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
