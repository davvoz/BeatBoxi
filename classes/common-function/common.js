export class Common {

    static createButton(text, callback, documentIn) {
        let button = documentIn.createElement('button');
        button.innerText = text;
        button.onclick = callback;
        return button;
    }
    static getMousePos(canvasIn, evt) {
        const rect = canvasIn.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    static animazione(callbackList) {
        requestAnimationFrame(() => {
            Common.animazione(callbackList);
        });
        callbackList.forEach(callback => {
            callback();
        });
    }
    static draw(shape, color, contextIn) {
        contextIn.fillStyle = color;
        contextIn.beginPath();
        contextIn.moveTo(shape[0][0], shape[0][1]);
        for (var i = 1; i < shape.length; i++) {
            contextIn.lineTo(shape[i][0], shape[i][1]);
        }
        contextIn.closePath();
        contextIn.fill();
    }
    /* funzione disegna una forma quadrata */
    static drawSquare(x, y, size) {
        return [[x, y], [x + size, y], [x + size, y + size], [x, y + size]];
    }
    /* funzione disegna poligono regolare con n lati */
    static getRegularPolygon(x, y, radius, n) {
        var shape = [];
        for (var i = 0; i < n; i++) {
            shape.push([x + radius * Math.cos(2 * Math.PI * i / n), y + radius * Math.sin(2 * Math.PI * i / n)]);
        }
        return shape;
    }
    /* funzione disegna triangolo */
    static drawTriangle(x, y, size) {
        return Common.getRegularPolygon(x, y, size, 3);
    }
    /* disegna un triangolo rettangolo */
    static drawRightTriangle(x, y, size) {
        return [[x, y], [x + size, y], [x, y + size]];
    }
    /* rileva tutti i tipi di collsioni */
    static collisionDetection(shape1, shape2) {
        return shape1.some((point1) => {
            return shape2.some((point2) => {
                return point1[0] === point2[0] && point1[1] === point2[1];
            });
        });
    }
    /* lancia una funzione random tra drawTriangle,drawRightTriangle,drawRegularPolygon,drawSquare */
    static randomShape(x, y, size) {
        const shape = [Common.drawTriangle(x, y, size), Common.drawRightTriangle(x, y, size), Common.getRegularPolygon(x, y, size, 5), Common.drawSquare(x, y, size)];
        return shape[Math.floor(Math.random() * shape.length)];
    }
    /* random color */
    static randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    /*canvas button*/
    static noteToFrequency(note) {
        //converti da lettere a frequenza
        const notes = {
            'C': 16.35,
            'C#': 17.32,
            'D': 18.35,
            'D#': 19.45,
            'E': 20.60,
            'F': 21.83,
            'F#': 23.12,
            'G': 24.50,
            'G#': 25.96,
            'A': 27.50,
            'A#': 29.14,
            'B': 30.87
        };
        const noteName = note.toUpperCase();
        const octave = noteName.slice(-1);
        const noteNumber = noteName.slice(0, -1);
        return notes[noteNumber] * Math.pow(2, octave);

    }
    //disegna bottone su canvas
    static drawButton(configIn, contextIn) {
        const { x, y, width, height, text, color, font, fontSize, fontColor, borderColor, borderWidth } = configIn;
        contextIn.fillStyle = color;
        contextIn.fillRect(x, y, width, height);
        contextIn.fillStyle = fontColor;
        contextIn.font = `${fontSize}px ${font}`;
        if (contextIn.measureText(text).width > width) {
            const textLines = text.split('\n');
            contextIn.textAlign = 'left';
            textLines.forEach((textLine, index) => {
                contextIn.fillText(textLine, x, y + fontSize * (index + 1));
                contextIn.strokeStyle = borderColor;
                contextIn.strokeText(textLine, x, y + fontSize * (index + 1));

            });
        } else {
            contextIn.font = `${fontSize}px ${font}`;
            contextIn.fillText(text, x + (width - contextIn.measureText(text).width) / 2, y + (height - fontSize) / 2 + fontSize);
        }
        // contextIn.strokeStyle = borderColor;
        // contextIn.lineWidth = borderWidth;
        // contextIn.strokeRect(x, y, width, height);
    }

    static getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //dra w rect x: 0, y: 0,width: canvas.width,height: canvas.height,color: '#000',borderColor: '#fff',borderWidth: 2
    static drawRect(configIn, contextIn) {
        const { x, y, width, height, color, borderColor, borderWidth } = configIn;
        contextIn.fillStyle = color;
        contextIn.fillRect(x, y, width, height);
        contextIn.strokeStyle = borderColor;
        contextIn.lineWidth = borderWidth;
        contextIn.strokeRect(x, y, width, height);
    }
    //function isInside(e.offsetX, e.offsetY, oggetto))
    static isInside(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }
}

export class Button {
    constructor(configIn, contextIn, callback, isToggleIn) {
        this.config = configIn;
        this.context = contextIn;
        this.isToggle = isToggleIn;
        this.callback = callback;
        this.toggleState = true;
        this.isHover = false;
    }

    draw() {
        let testo ;
        if (this.isToggle) {
            if (this.toggleState) {
                //disegna qua rettangolo
                this.context.fillStyle = this.config.color;
                this.context.fillRect(this.config.x, this.config.y, this.config.width, this.config.height);
                this.context.strokeStyle = this.config.borderColor;
                this.context.lineWidth = this.config.borderWidth;
                this.context.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);
                this.context.fillStyle = this.config.fontColor;
                testo = this.config.text;
            } else {
                //disegna qua rettangolo
                this.context.fillStyle = this.config.toggleColor;
                this.context.fillRect(this.config.x, this.config.y, this.config.width, this.config.height);
                this.context.strokeStyle = this.config.borderColor;
                this.context.lineWidth = this.config.borderWidth;
                this.context.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);
                this.context.fillStyle = this.config.fontColor;
                testo = this.config.toggleText;
            }
        } else {
            //disegna qua rettangolo
            this.context.fillStyle = this.config.color;
            this.context.fillRect(this.config.x, this.config.y, this.config.width, this.config.height);
            this.context.strokeStyle = this.config.borderColor;
            this.context.lineWidth = this.config.borderWidth;
            this.context.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);
            this.context.fillStyle = this.config.fontColor;
            testo = this.config.text;
        }
        this.context.font = `${this.config.fontSize}px ${this.config.font}`;
        const textLines = testo.split('\n');
        this.context.textAlign = 'left';
        textLines.forEach((textLine, index) => {
            this.context.fillStyle = this.config.fontColor;
            this.context.fillText(textLine, this.config.x + (this.config.width - this.context.measureText(textLine).width) / 2, this.config.y + this.config.fontSize * (index + 1));
            this.context.strokeStyle = this.config.borderColor;
            this.context.strokeText(textLine, this.config.x + (this.config.width - this.context.measureText(textLine).width) / 2, this.config.y + this.config.fontSize * (index + 1));
        });
        if(this.isHover)    {
            this.context.fillStyle = this.config.hoverColor;
            this.context.fillRect(this.config.x, this.config.y, this.config.width, this.config.height);
            this.context.strokeStyle = this.config.borderColor;
            this.context.lineWidth = this.config.borderWidth;
            this.context.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);
            this.context.fillStyle = this.config.fontColor;
            textLines.forEach((textLine, index) => {
                this.context.fillText(textLine, this.config.x + (this.config.width - this.context.measureText(textLine).width) / 2, this.config.y + this.config.fontSize * (index + 1));
                this.context.strokeStyle = this.config.borderColor;
                this.context.strokeText(textLine, this.config.x + (this.config.width - this.context.measureText(textLine).width) / 2, this.config.y + this.config.fontSize * (index + 1));
            });
        }

    }

    click() {
        if (this.isToggle) {
            this.toggleState = !this.toggleState;
        }
        this.draw();
        this.callback();
    }

    isInside(x, y) {
        return Common.isInside(x, y, {
            x: this.config.x,
            y: this.config.y,
            width: this.config.width,
            height: this.config.height
        });
    }
    hover() {
        this.isHover = true;
        this.draw();
    }
    unhover() {
        this.isHover = false;
        this.draw();
    }
    
}

export default Common;
