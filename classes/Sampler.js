
class Sampler {
    constructor(contextAudio, library, index) {
        this.contextAudio = contextAudio;
        this.library = library;
        this.suono = contextAudio.createBufferSource();
        this.connection = this.library.getSample(index).then(buffer => {
            this.suono.buffer = buffer;
            this.suono.connect(contextAudio.destination);
        })
    }
    start() {
        this.suono.start();
    }
    stop() {
        this.suono.stop();
    }
}
export default Sampler;
