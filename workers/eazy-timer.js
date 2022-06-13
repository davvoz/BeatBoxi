const LOOP_LENGTH = 32;
let noteTime = 0.0;
let startTime = 0.0;
let rhythmIndex = 0;
let requestId = 0;
let tempo = 60.0;
let currentTime = 0;
onmessage = (e) => {
    if (e.data.command === 'start') {
        tempo = e.data.bpm;
        handlePlay();
    }
    if (e.data.command === 'stop') {
        cancelAnimationFrame(requestId);
    }
    if (e.data.command === 'changeBpm') {
        tempo = e.data.bpm;
    }
    if (e.data.command === 'currentTime') {
        currentTime = e.data.currentTime;
    }

}
function handlePlay() {
    noteTime = 0.0;
    startTime = currentTime + 0.005;
    rhythmIndex = 0;
    schedule();
}

function handleStop() {
    cancelAnimationFrame(requestId);
}

function schedule() {
    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.

    currentTime -= startTime;
    while (noteTime < currentTime + 0.200) {
        var contextPlayTime = noteTime + startTime;
        //post message  to the main thread
        postMessage({
            message: 'tick',
            rhythmIndex: rhythmIndex,
            contextPlayTime: contextPlayTime
        });
        advanceNote();
    }
    requestId = requestAnimationFrame(schedule);

}

function advanceNote() {
    // Setting tempo to 60 BPM just for now

    var secondsPerBeat = 60.0 / tempo;

    rhythmIndex++;
    if (rhythmIndex == LOOP_LENGTH) {
        rhythmIndex = 0;
    }

    //0.25 because each square is a 16th note
    noteTime += 0.25 * secondsPerBeat;
}