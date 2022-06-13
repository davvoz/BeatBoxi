import Muro from './classes/Muro.js';
import Pallina from './classes/Pallina.js';
import BarraVita from './classes/BarraVita.js';
import FormaStellaSei from './classes/Forma.js';
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
//centro il canvas
canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';
document.body.appendChild(canvas);
const context = canvas.getContext('2d');
let forma = new FormaStellaSei({
    x: Math.random() * canvas.width,
    y: -100,
    radius: Math.random() * 30 + 10,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
}, context);
let palline = [];
let muros = [];
let info = '';
let vita = 1000;
let isMuri = false;
let counterGiri = 0;
//inventa un titolo veramente  divertente che sia almeno di 5 parole e con un acronimo
const titolo = 'ACRONYM - ' + Math.floor(Math.random() * 100000).toString(36) + ' of a millions of words';
const sottotitolo = 'Run, the game';
const sottotitolo4 = 'Informazioni sui muri :';
const sottotitolo5 = 'I muri sono brutti, ma non sono molto brutti';
const sottotitolo6 = 'Informazioni sulle palline :';
const sottotitolo7 = 'Le palline non sono più veloci di una pallina di una macchina';
let sottotitolo9 = 'Tu hai una vita di ' + vita + ' punti vita';
let sottoTitoli = [sottotitolo9, sottotitolo7, sottotitolo6, sottotitolo5, sottotitolo4, sottotitolo];
/*scrivi i dettagli sullo schermo*/
info = `Palline: ${palline.length}` + '\n' + `Muri: ${muros.length}`;
/*aggiungi la vita alle info */
info += '\n' + `Vita: ${vita}`;
context.fillStyle = 'rgba(255,25,155,0.5)';


let indicatore = 1;
const barraVitaConfig = {
    x: 0,
    y: canvas.height - 100,
    width: 200,
    height: 20,
    color: 'rgba(255, 0, 0, 0.5)'
};
const barraVita = new BarraVita(barraVitaConfig, context, 1000);
let maxSquares = 10;
/*aggiorna la posizione delle palline e dei Muri*/
function update() {

    if (vita > 0) {
        /*aggiorna la posizione delle palline*/
        scritte();
        game();
    } else {
        //ricominciamo
        vita = 1000;
        palline = [];
        muros = [];
        counterGiri = 0;
        isMuri = false;
        indicatore = 1;
    }

    //piu piccolo sotto scrivi un sottotitolo
    context.font = '100px Impact';
    context.fillStyle = 'gold';
    context.strokeStyle = 'black';
    context.fillText(vita, 0, canvas.height - 100);
    context.strokeText(vita, 0, canvas.height - 100);
    context.restore();
    barraVita.draw(vita);
}

function game() {
    if (counterGiri % 1000 === 0) {
        for (let i = 0; i < indicatore / 2; i++) {
            const radius = Math.random() * 30 + 10;
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            const config = {
                x: Math.random() * canvas.width,
                y: -radius,
                radius: radius,
                color: color
            };

            const pallina = new Pallina(config, context);
            pallina.mass = pallina.radius * pallina.radius * Math.PI;
            pallina.vx = 1;
            pallina.vy = 1;
            pallina.draw();
            palline.push(pallina);
        }
    }
    let isMuriDisegnati = false;
    palline.forEach(pall => {
        if (pall.counterCollision < pall.counterTrashold) {
            if (!pall.checkBianco()) {
                if (pall.checkBounds()) {
                    palline.splice(palline.indexOf(pall), 1);
                    //elimina tanta vita quanta è rimanente nella pallina
                    vita -= pall.counterTrashold - pall.counterCollision;
                }
                pall.update();

                muros.forEach(muro => {
                    if (muro.x && muro.y && muro.width && muro.height) {
                        if (muro.counterTrashold - muro.counterCollision <= 0) {
                            muros.splice(muros.indexOf(muro), 1);
                        } else if (pall.x && pall.y && pall.radius) {
                            pall.checkMuro(muro);
                            muro.draw();
                            isMuriDisegnati = true;
                        }
                    }
                });
                /*per ogni pallina controlla se è colliduta con altre*/
                palline.forEach(pall2 => {
                    if (pall !== pall2) {
                        pall.collision(pall2);
                    }
                });

                pall.draw()
            }

        } else {
            palline.splice(palline.indexOf(pall), 1);

        }
    });
    if (!isMuriDisegnati) {
        muros.forEach(muro => {
            muro.draw();
        });
    }
}

function scritte() {
    context.save();
    context.font = '70px Arial';
    context.fillStyle = 'gold';
    context.lineWidth = 1;
    context.strokeStyle = 'green';
    context.fillText(titolo, (canvas.width - context.measureText(titolo).width) / 2, 100);
    context.strokeText(titolo, (canvas.width - context.measureText(titolo).width) / 2, 100);
    context.restore();
    context.save();
    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    //sctrivi tutti i sottotitoli
    sottoTitoli.forEach((sott, index) => {
        if (sott === sottotitolo9) {
            sott = 'Tu hai una vita di ' + vita + ' punti vita';
        }
        context.fillText(sott, (canvas.width - context.measureText(sott).width) / 2, canvas.height - (index + 1) * 50 - 400);
        context.strokeText(sott, (canvas.width - context.measureText(sott).width) / 2, canvas.height - (index + 1) * 50 - 400);
    });
    context.restore();

}

/*funzione scrivi sulla canvas i dettagli degli elementi*/
function writeInfo() {
    info = `Palline: ${palline.length}` + '\n' + `Muri: ${muros.length}`;
    //aggiungi il maxSquares e il max palline
    info += '\n' + `maxSquares: ${maxSquares}`;
    context.save();
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.fillText(info, 10, canvas.height - 10);
    context.strokeText(info, 10, canvas.height - 10);
    context.restore();
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/*funzione animazione : è un ciclo infinito che chiama le callbacks in input , usa setRequestAnimationFrame*/
function animazione(callbackList) {
    requestAnimationFrame(() => {
        animazione(callbackList);
    });
    callbackList.forEach(callback => {
        callback();
    });
}
//se clicco la canvas aggiungo altre palline
canvas.addEventListener('click', () => {
    //in quel punto del canvas
    const x = event.offsetX;
    const y = event.offsetY;
    let clicked = false;
    let pallinaCliccata = false;
    //se clicco su un muro lo elimino
    muros.forEach(muro => {
        if (x > muro.x && x < muro.x + muro.width && y > muro.y && y < muro.y + muro.height) {
            muros.splice(muros.indexOf(muro), 1);
            clicked = true;
        }
    });
    if (!clicked) {
        //se clicco su una pallina la elimino
        palline.forEach(pallina => {
            if (x > pallina.x && x < pallina.x + pallina.radius && y > pallina.y && y < pallina.y + pallina.radius) {
                palline.splice(palline.indexOf(pallina), 1);
                pallinaCliccata = true;
                // e rubo i rimanenti counterCollision
                vita += pallina.counterTrashold - pallina.counterCollision;
            }
        });
        if (!pallinaCliccata) {
            for (let i = 0; i < 5; i++) {
                const radius = Math.random() * 30 + 10;
                const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                const config = { x, y, radius, color };
                const pallina = new Pallina(config, context);
                pallina.mass = pallina.radius * pallina.radius * Math.PI;
                pallina.vx = 1;
                pallina.vy = 1;
                pallina.draw();
                palline.push(pallina);
            }
        }
    }
});

function addCount() {
    if (counterGiri === 1000) {
        indicatore++;
        maxSquares = indicatore * 10;
        sottotitolo9 = 'Max Squares: ' + maxSquares;
        counterGiri = 0
    } else {
        counterGiri++;
    }
}
/*cahce mouse position  */
let mousePos = { x: 0, y: 0 };
/*se schiacci space aggiungo un muro , nel punto del mouse*/
//se schiaccio p 
document.addEventListener('keydown', (event) => {
    if (muros.length < maxSquares) {
        if (event.key === 'p') {
            const x = mousePos.x - canvas.offsetLeft;
            const y = mousePos.y - canvas.offsetTop;
            const width = 100;
            const height = 100;
            const config = { x, y, width, height, color: '#000000' };
            const muro = new Muro(config, context, 200 * indicatore);
            muro.draw();
            muros.push(muro);
        }
    }
});

/*ascolta il mouemove e aggiorna la posizione del mouse*/
canvas.addEventListener('mousemove', (event) => {
    mousePos = getMousePos(canvas, event);
});


//retrive mouse position from keyboard event javascript
function getMousePos(canvasIn, evt) {
    const rect = canvasIn.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


animazione([clear, addCount, update, writeInfo]);









