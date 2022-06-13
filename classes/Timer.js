export class Timer {
    constructor(bpm, callbackList, worker ,audioContextIn) {
        this.bpm = bpm;
        this.callbackList = callbackList;
        this.isStarted = false;
        this.worker = worker;
        this.audioContext = audioContextIn;
        this.index = 0;
        this.worker.onmessage = (e) => {
            if (e.data.message === 'tick') {
                this.worker.postMessage({
                    command: 'currentTime',
                    currentTime: this.audioContext.currentTime
                });
                this.index = e.data.rhythmIndex;
                this.callbackList.forEach((callback) => {
                    callback();
                });
            }
        };
    }

    start() {
        this.worker.postMessage({
            command: 'start',
            bpm: this.bpm,
        });
        this.isStarted = true;
    }

    stop() {
        this.worker.postMessage({
            command: 'stop'
        });
        this.isStarted = false;
    }

    changeBpm(bpm) {
        this.worker.postMessage({
            command: 'changeBpm',
            bpm:  bpm
        });
    }
  
}
export default Timer;
