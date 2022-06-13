export class AbstractShape {
    constructor(contextIn, config) {
        this.config = config;
        this.context = contextIn;
    }
    draw() {
        //draw the shape
    }
    update() {
        //update the shape
    }
    checkCollision() {
        //check if the shape is colliding with another shape
    }
}
export default AbstractShape;
