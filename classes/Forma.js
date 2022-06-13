export class FormaStellaSei {
    constructor(x, y, radius, color, contextIn) {
        this.x = x; this.y = y;
        this.radius = radius;
        this.color = color;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.lineWidth = 1;
        this.context = contextIn;
    }
    draw() {
        if(this.context) {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(this.rotation);
            this.context.scale(this.scaleX, this.scaleY);
            this.context.lineWidth = this.lineWidth;
            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.moveTo(0, 0 - this.radius);
            for (var i = 0; i < 12; i++) {
                this.context.rotate(Math.PI / 6);
                this.context.lineTo(0, 0 - (this.radius * 0.5));
                this.context.rotate(Math.PI / 6);
                this.context.lineTo(0, 0 - this.radius);
            }
            this.context.fill();
            if (this.lineWidth > 0) {
                this.context.stroke();
            } 
            this.context.restore();
        } 
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
export default FormaStellaSei
