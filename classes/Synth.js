export class Synth {
    constructor(destination, audioContext) {
        this.destination = destination;
        this.audioContext = audioContext;
        this.gain = audioContext.createGain();
        this.envelope = {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.1
        };
        this.gain.connect(this.destination);

    }

    setVolume(volume) {
        this.gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }

    setEnvelope(envelope) {
        this.envelope = envelope;
    }

    play(frequency, waveform) {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = waveform;
        this.oscillator.connect(this.gain);
        this.oscillator.start(0);
       this.gain.gain.setValueAtTime(0, this.audioContext.currentTime);
         this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        this.gain.gain.exponentialRampToValueAtTime(
            this.envelope.sustain,
            this.audioContext.currentTime + this.envelope.attack
        );
        this.gain.gain.exponentialRampToValueAtTime(
            this.envelope.sustain,
            this.audioContext.currentTime + this.envelope.decay
        );
        this.gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + this.envelope.release
        );
        this.oscillator.stop(this.audioContext.currentTime + this.envelope.release);
    }
    /*createProgram webgl*/
    static createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        }
        return program;
    }

}
