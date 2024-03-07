class Player {
  constructor(game) {
    this.game = game;
    this.x = 30;
    this.y;
    this.spriteWidth = 140;
    this.spriteHeight = 210;
    this.width;
    this.height;
    this.speedY = 0;
    this.flapSpeed;
    this.colitionX;
    this.colitionY;
    this.colitionRadius;
    this.collided = false;
    this.energy = 50;
    this.maxEnergy = 100;
    this.minEnergy = 0;
    this.isCharging = false;
    this.barsize;
    this.image = document.getElementById("goku");
    this.frameY;
  }
  draw() {
    //fillRect(x,y,width,height) sirve para dibujar un rectángulo
    this.game.ctx.drawImage(
      this.image,
      0,
      this.frameY * (this.spriteHeight + 80),
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.game.ctx.beginPath();
    //arc(x, y, radius, startAngle, endAngle, anticlockwise)
    this.game.ctx.arc(
      this.colitionX +25 * this.game.ratio,
      this.colitionY +20 * this.game.ratio,
      this.colitionRadius,
      0,
      2 * Math.PI
    );
    //draw the circle
    this.game.ctx.stroke();
  }
  update() {
    this.y += this.speedY;
    this.handleEnergy();
    this.colitionRadius = this.width * 0.5 -5;
    this.colitionY = this.y  + this.colitionRadius;
    this.colitionX = this.x  + this.colitionRadius;
    if (!this.isTouchingBottom() && !this.isCharging) {
      this.speedY += this.game.gravity;
    } else {
      this.speedY = 0;
    }
    if (this.isTouchingBottom()) {
      this.speedY = 0;
      this.y = this.game.height - this.height;
    }
  }
  startCharge() {
    this.isCharging = true;
    this.game.speed = this.game.maxSpeed;
    this.frameY = 1;
  }
  stopCharge() {
    this.isCharging = false;
    this.game.speed = this.game.minSpeed;
    this.frameY = 0;
  }
  handleEnergy() {
    if (this.game.eventUpdate) {
      if (this.energy < this.maxEnergy && !this.isCharging) {
        this.energy += 0.5;
      }
      if (this.energy < 0) {
        this.energy = 0;
        this.stopCharge();
      }
      if (this.isCharging) {
        this.energy -= 5;
      }
    }
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    //para que el rectángulo sea dibujado en el centro de la pantalla
    this.y = this.game.height / 2 - this.height / 2;
    //para que el rectangulo de un salto al ser dibujado en el centro de la pantalla
    this.speedY = -5 * this.game.ratio;
    this.flapSpeed = 4 * this.game.ratio;
    this.colitionRadius = this.width * 0.5 -5;
    this.colitionY = this.y  + this.colitionRadius;
    this.colitionX = this.x  + this.colitionRadius;
    this.collided = false;
    this.barsize = Math.floor(5 * this.game.ratio);
    this.energy = 50;
    this.frameY = 0;
    this.isCharging = false;
  }
  flap() {
    this.stopCharge();
    if (!this.isTouchingTop()) {
      this.speedY = -this.flapSpeed;
    }
  }

  isTouchingTop() {
    return this.y <= 0;
  }
  isTouchingBottom() {
    return this.y >= this.game.height - this.height;
  }
}
