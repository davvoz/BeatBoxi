/*classe Barra della vita */
export class BarraVita {
    constructor(config, contextIn) {
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.color = config.color;
        this.context = contextIn;
    }
    //disegna la barra della vita
    draw(vitaIn) {
        this.context.save();
        this.context.fillStyle = this.color;
        let lunghezza = vitaIn * 2;
        this.context.fillRect(this.x, this.y, lunghezza, this.height);
        this.context.restore();
    }
    checkCollision(pall) {
        return (this.x < pall.x + pall.radius && this.x + this.width > pall.x - pall.radius && this.y < pall.y + pall.radius && this.y + this.height > pall.y - pall.radius);
    }

}
export default BarraVita;