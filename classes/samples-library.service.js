
export class SamplesLibraryService {
  buffers = [];
  constructor(_audioContext) {
    this.loadSounds('./assets/wav/snare.wav')//C:\Users\Compiuter\Desktop\prova\assets\wav\snare.wav
  }

  loadSounds(path) {
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    const context = this._audioContext;
    request.onload = () => {
      context.decodeAudioData(
        request.response,
        buffer => {
          if (!buffer) {
            alert('error decoding file data: ' + path);
            return;
          }
          this.buffers.push(buffer);
        },
        error => {
          console.error('decodeAudioData error', error);
        }
      );
    };
    request.onerror = () => {
      throw Error("Load sound failed")
    };
    request.send();
  }
  getSample(index) {
    return this.buffers[index];
  }
  getSamples() {
    return this.buffers;
  }
}
export default SamplesLibraryService;