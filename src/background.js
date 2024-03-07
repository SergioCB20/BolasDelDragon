class Background {
  constructor(game) {
    this.game = game;
    this.image1 = document.getElementById("background-1");
    this.image2 = document.getElementById("background-2");
    this.width = 2400;
    this.height = this.game.height;
    this.x;
    this.scaledWidth;
    this.scaledHeight;
  }
  update() {
    this.x -= this.game.speed;
    if (this.x < -this.width) this.x = 0;
  }

  /* DrawImage(image: Image, x: number, y: number, width: number, height)*/
  draw() {
    this.game.ctx.drawImage(
      this.image1,
      this.x,
      0,
      this.scaledWidth,
      this.scaledHeight
    );
    this.game.ctx.drawImage(
      this.image2,
      this.x + this.scaledWidth - 2,
      0,
      this.scaledWidth,
      this.scaledHeight
    );
    this.game.ctx.drawImage(
      this.image1,
      this.x + 2* this.scaledWidth - 2, 
      0,
      this.scaledWidth,
      this.scaledHeight
    );
    if (this.game.canvas.width >= this.scaledWidth) {
      this.game.ctx.drawImage(
        this.image1,
        this.x + this.scaledWidth * 2 - 2,
        0,
        this.scaledWidth,
        this.scaledHeight
      );
    }
  }
  resize() {
    this.x = 0;
    this.scaledWidth = this.width * this.game.ratio;
    this.scaledHeight = this.height * this.game.ratio;
  }
}
