

let start;
let accurateStop;
let round;
let timeout;
let expected = 0;
onmessage = (e) => {
    console.log(e.data);
    let speed = e.data.speed;
    let command = e.data.command;
    
    accurateTimer( speed, console.log('error'));
    if (command === 'start') {
        start();
    } else if(command === 'stop'){
        accurateStop();
    }
    postMessage(e.data);
}

function accurateTimer( timeInterval,errorCallback) {
    let speed = timeInterval;

    start = () => {
        expected = performance.now() + speed;
        timeout = setTimeout(round, speed)
        console.log('started');
    }

    accurateStop = () => {
        clearTimeout(timeout);
    }

    round = () => {
        let drift = performance.now() - expected;
        if (drift > speed) {
            if (errorCallback) {
                errorCallback();
            }
        }
        postMessage({   message: 'tick' });

        expected += speed;
        timeout = setTimeout(round, speed - drift);
    }
   
}