export class Circle {
  vx = 0.01;
  vy = 0.01;
  ax = 0.01;
  ay = 0.01;
  angle = 0;
  angleSpeed = 0;
  angleAcceleration = 0;
  life = 0;
  ctx;
  countDirection = 0;
  c = {
    r: 0,
    g: 0,
    b: 0
  };
target;
  constructor(x, y, r, c, canvasContext) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.life = 10 * r;
    this.ctx = canvasContext;
    
  }

  draw() {
    this.ctx.fillStyle = 'rgb(' + Math.floor(this.c.r) + ',' + Math.floor(this.c.g) + ',' + Math.floor(this.c.b) + ')';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fill();
    //disegna una sezione di un quarto di circonferenza all 'interno' del cerchio
    
    this.ctx.beginPath();
    this .ctx.stokeStyle = 'rgb(' + Math.floor(this.c.r) + ',' + Math.floor(this.c.g) + ',' + Math.floor(this.c.b) + ')';
    this.ctx.lineWidth = 4;
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI / 2);
    this.ctx.stroke();

    //scrivi il numero di vita
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText(this.life, this.x, this.y);
    //scrivi il countDirection
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText(this.countDirection,this.x , this.y + this.r);
  }

  distance(circle) {
    return Math.sqrt(Math.pow(this.x - circle.x, 2) + Math.pow(this.y - circle.y, 2));
  }

  move(p) {
    this.x = p.x;
    this.y = p.y;
    this.vx = p.vx;
    this.vy = p.vy;
  }

  getDirection(cerchio) {
    return {
      x: this.x - cerchio.x,
      y: this.y - cerchio.y
    }
  }

  bounce(p) {
    var dx = x - p.x;
    var dy = y - p.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var vx = dx / d;
    var vy = dy / d;
    var x = p.x + vx * (r + p.r);
    var y = p.y + vy * (r + p.r);
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }

  rotate(p) {
    this.x = p.x;
    this.y = p.y;
    this.angle += angleSpeed;
    this.angleSpeed += angleAcceleration;
  }
  //funzione ruota attorno ad un altro cerchio */
  rotateAround(x1, y1, r1, x2, y2, r2, angle) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var d = Math.sqrt(dx * dx + dy * dy);
    var vx = dx / d;
    var vy = dy / d;
    var x = x2 + vx * (r1 + r2);
    var y = y2 + vy * (r1 + r2);
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }

  flee(circle) {
    var dx = this.x - circle.x;
    var dy = this.y - circle.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var vx = dx / d;
    var vy = dy / d;
    var x = circle.x + vx * (circle.r + this.r);
    var y = circle.y + vy * (circle.r + this.r);
    var cos = Math.cos(this.angle);
    var sin = Math.sin(this.angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }
 
  sumCirclesAreaAndColor(circle) {
    return new Circle(
      this.x + circle.x,
      this.y + circle.y,
      this.r + circle.r, {
      r: this.this.c.r + circle.this.c.r,
      g: this.this.c.g + circle.this.c.g,
      b: this.this.c.b + circle.this.c.b
    });
  }

  setAcceleration(ax, ay) {
    this.ax = ax;
    this.ay = ay;
  }

  setAngleAcceleration(angleAcceleration_) {
    this.angleAcceleration = angleAcceleration_;
  }

  seek(circle) {
    var dx = circle.x - this.x;
    var dy = circle.y - this.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var vx = dx / d;
    var vy = dy / d;
    return {
      x: this.x + vx * this.r,
      y: this.y + vy * this.r
    };
  }

  checkBounds() {
    if (this.x + this.r > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.r;
      this.vx = -this.vx;
    } else if (this.x - this.r < 0) {
      this.x = this.r;
      this.vx = -this.vx;
    }
    if (this.y + this.r > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.r;
      this.vy = -this.vy;
    } else if (this.y - this.r < 0) {
      this.y = this.r;
      this.vy = -this.vy;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx += this.ax;
    this.vy += this.ay;
    this.angle += this.angleSpeed;
    this.angleSpeed += this.angleAcceleration;
    this.checkBounds();
    if(this.countDirection>100){
      this.countDirection=0;
    }else{
      this.countDirection++;
    }
  }


  collision(cerchio) {
    var dx = this.x - cerchio.x;
    var dy = this.y - cerchio.y;
    var d = Math.sqrt(dx * dx + dy * dy);

    if (d < this.r + cerchio.r) {
      var vx = dx / d;
      var vy = dy / d;
      var x = cerchio.x + vx * (this.r + cerchio.r);
      var y = cerchio.y + vy * (this.r + cerchio.r);
      var cos = Math.cos(this.angle);
      var sin = Math.sin(this.angle);
      //se collide toglie una life

      return {
        x: x * cos - y * sin,
        y: x * sin + y * cos
      };
    }

    return d < this.r + cerchio.r;
  }

}

export default Circle;
