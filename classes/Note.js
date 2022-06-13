import { Synth } from './Synth.js';


export class Note {
    constructor(frequency, waveform, destination, audioContext) {
        this.oscillator = new Synth(destination, audioContext);
        this.frequency = frequency;
        this.waveform = waveform;
    }

    play() {
        this.oscillator.play(this.frequency, this.waveform);
    }
}
export class NoteSampler {
     
}
export default Note;
