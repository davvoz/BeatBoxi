class RequestAnimationControl {
    constructor(callIn) {
        this.isPaused = false;
        this.fooList = callIn;
    }
    pause() {
        this.isPaused = true;
    }
    restore() {
        this.isPaused = false;
        this.animazione();
    }
    animazione() {
        if (this.isPaused) return;
        requestAnimationFrame(() => {
            this.animazione(this.fooList);
        });
        this.fooList.forEach(callback => {
            callback();
        });
    }
}
export default RequestAnimationControl;