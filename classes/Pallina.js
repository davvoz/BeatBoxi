/* ECMA 6 */
/*classe Pallina ha in input configurazione pallina*/
export class Pallina {
    constructor(config, contextIn) {
        this.x = config.x;
        this.y = config.y;
        this.radius = config.radius;
        this.color = config.color;
        this.scritta = config.scritta;
        this.isShowing = config.isShowing;
        this.context = contextIn;
        this.mass = this.radius * this.radius * Math.PI;
        this.counterCollision = 0;
        this.counterTrashold = 100;
        this.vx = 0;
        this.vy = 0;
    }
    /*metodo per disegnare la pallina*/
    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.color;
        this.context.fill();
        //scrivi il numero di collisioni mancanti a morire 200 - counterCollision
        this.context.restore();
        this.context.save();
        //la grandezza della scritta è il raggio della pallina
        this.context.font = this.radius + "px Impact";
        this.context.fillStyle = "white";
        this.context.strokeStyle = "black";
        if (this.isShowing) {
            this.context.fillText(this.scritta, this.x - this.radius / 2, this.y + this.radius / 2);
            this.context.strokeText(this.scritta, this.x - this.radius / 2, this.y + this.radius / 2);
        } else {
            this.context.fillText(this.counterTrashold - this.counterCollision, this.x - this.radius / 2, this.y + this.radius / 2);
            this.context.strokeText(this.counterTrashold - this.counterCollision, this.x - this.radius / 2, this.y + this.radius / 2);
        }

        this.context.restore();
    }
    //impedisci alla pallina di andare fuori dal this.context.canvas
    checkBounds() {
        if (this.x + this.radius > this.context.canvas.width) {
            this.x = this.context.canvas.width - this.radius;
            this.vx *= -1;
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -1;
        }
        if (this.y + this.radius > this.context.canvas.height) {
            this.y = this.context.canvas.height - this.radius;
            this.vy *= -1;
            return true;
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -1;
        }
        return false;
    }
    /*metodo per aggiornare la posizione della pallina*/
    update() {
        /* la gravità è terrestre */
        this.vy += 0.1;
        this.x += this.vx;
        this.y += this.vy;
        this.updateVelocity();
    }

    /*metodo per aggiornare la velocità della pallina*/
    updateVelocity() {
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    /*collisione tra due palline*/
    collision(pallina2) {
        //SE COLLIDONO NON SI SOVRAPPONGONO
        if (this.x + this.radius > pallina2.x - pallina2.radius && this.x - this.radius < pallina2.x + pallina2.radius && this.y + this.radius > pallina2.y - pallina2.radius && this.y - this.radius < pallina2.y + pallina2.radius) {
            //incrementa la sua posizione dove c'è spazio libero
            this.x += this.vx;
            this.y += this.vy;
            //aggiorna la velocità
        }         
    }
    addBounce() {
        this.counterCollision++;
        if (this.counterCollision === this.counterTrashold / 2) {
            this.color = "yellow";
        }
        if (this.counterCollision === this.counterTrashold / 3) {
            this.color = "red";
        }
    }

    checkMuro(muro) {

        if (this.x + this.radius > muro.x && this.x - this.radius < muro.x + muro.width && this.y + this.radius > muro.y && this.y - this.radius < muro.y + muro.height) {
            if (this.x + this.radius > muro.x + muro.width / 2) {
                this.x = muro.x + muro.width + this.radius;
            } else {
                this.x = muro.x - this.radius;
            }
            if (this.y + this.radius > muro.y + muro.height / 2) {
                this.y = muro.y + muro.height + this.radius;
            } else {
                this.y = muro.y - this.radius;
            }
            this.vx *= -1;
            this.vy *= -1;
            muro.addBounce(Math.floor(Math.abs(this.vx), Math.abs(this.vy)) * 2);
            this.addBounce();
        }

    }
    /* crea un metodo che detrmina se la pallina è circondata solo da bianco*/
    checkBianco() {
        //recupera posizione pallina
        const x = this.x;
        const y = this.y;
        //recupera dimensione pallina
        const r = this.radius;
        //controlla se la pallina è circondata da bianco e casta i valori
        const imageData = this.context.getImageData(x - r, y - r, 2 * r, 2 * r)
        if (imageData) {
            const color = imageData.data;
            //se è bianco torna true
            if (color[0] === 255 && color[1] === 255 && color[2] === 255 && color[3] === 255) {
                return true;
            }
        }
        return false;
    }
    /*la palla rimbalza */

    rimbalza(indicator) {
        this.vx = -this.vx * 0.8 * indicator;
        this.vy = -this.vy * 0.8 * indicator;
    }
    setCounterTrashold(counterTrashold) {
        this.counterTrashold = counterTrashold;
    }

    //muova la pallina in una direzione
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    
    checkCollision(shape) {
        if (shape instanceof Pallina) {
            return this.collision(shape);
        } else {
            return this.checkMuro(shape);
        }
    }

}
export default Pallina;