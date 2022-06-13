const LOOP_LENGTH = 32;
export class TimerScheduler {
    constructor(bpm, callbackList, audioContextIn) {
        this.bpm = bpm;
        this.callbackList = callbackList;
        this.isStarted = false;
        this.audioContext = audioContextIn;
        this.requestId = 0;
        this.rhythmIndex = 0;
        this.noteTime = 0.0;
        this.startTime = 0.0;
        this.contextPlayTime = 0.0;
        console.log('TimerScheduler created', this);

    }

    action() {
        this.callbackList.forEach((callback) => {
            callback( );
        });
    }


    handlePlay() {
        this.noteTime = 0.0;
        if (typeof this.audioContext.currentTime !== 'undefined') {
            this.startTime = this.audioContext.currentTime + 0.005;
            this.rhythmIndex = 0;
            this.schedule();
        }
    }

    handleStop() {
        cancelAnimationFrame(this.requestId);
    }

    schedule() {
        // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
        var currentTime = this.audioContext.currentTime - this.startTime;
       
        while (this.noteTime < currentTime + 0.200) {
            this.contextPlayTime = this.noteTime + this.startTime;
            this.action(this.noteTime + this.startTime);
            this.advanceNote();
        }
        this.requestId = requestAnimationFrame(this.schedule.bind(this));
       
    }

    advanceNote() {
        // Setting tempo to 60 BPM just for now
        var secondsPerBeat = 60.0 / this.bpm;
        this.rhythmIndex++;
        if (this.rhythmIndex == LOOP_LENGTH) {
            this.rhythmIndex = 0;
        }
        //0.25 because each square is a 16th note
        this.noteTime += 0.25 * secondsPerBeat;
    }
}

export default TimerScheduler;

