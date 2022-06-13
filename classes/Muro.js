/*classe Muro ha in input configurazione muro*/
export class Muro {
    constructor(config, contextIn, counterTrasholdIn) {
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.color = config.color;
        this.context = contextIn;
        this.counterCollision = 0;
        this.counterTrashold = counterTrasholdIn;
    }
    /*metodo per disegnare il muro*/
    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.rect(this.x, this.y, this.width, this.height);
        this.context.fillStyle = this.color;
        this.context.fill();
        //scrivi il numero di bounce per arrivare a zero
        this.context.restore();
        this.context.save();

        this.context.font = "50px Arial";
        this.context.fillStyle = "green";
        this.context.strokeStyle = "grey";
        //scrivilo al centro del muro
        this.context.fillText(this.counterTrashold - this.counterCollision, this.x + this.width / 2, this.y + this.height / 2);
        this.context.strokeText(this.counterTrashold - this.counterCollision, this.x + this.width / 2, this.y + this.height / 2);
        this.context.restore();
    }
    update() {
        //se il muro è stato toccato incrementa il contatore di collisioni
        if (this.counterCollision < this.counterTrashold) {
            this.counterCollision++;
        }
    }
    contains(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
    esplode() {
        //esplode in pezzi di muro con dimensioni random ma la cui somma delle aree è uguuale all'area del muro
        const pieces = [];
        const n = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < n; i++) {
            const p = {
                x: this.x + Math.random() * this.width,
                y: this.y + Math.random() * this.height,
                width: this.width / n,
                height: this.height / n
            };
            const muro = new Muro(p, this.context, this.counterTrashold);
            pieces.push(muro);
        }
        return pieces;
    }
    addBounce(incremental) {

        if (this.counterCollision === this.counterTrashold / 2) {
            this.color = "yellow";
        }
        if (this.counterCollision >= this.counterTrashold / 3) {
            this.color = 'red';
        }

        this.counterCollision += incremental;
    }

    checkCollision(ball) {
        if (this.contains(ball.x, ball.y)) {
            return true;
        }
        return false;
    }
    
}
export default Muro;
