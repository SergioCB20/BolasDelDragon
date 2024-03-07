class Game {
  constructor(canvas, context, numberOfObstacles) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.ratio = this.height / this.baseHeight;
    this.background = new Background(this);
    this.player = new Player(this);
    this.obstacles = [];
    this.numberOfObstacles = numberOfObstacles;
    this.resize(window.innerWidth, window.innerHeight);
    this.gravity;
    this.speed;
    this.score;
    this.gameOver;
    this.timer;
    this.minSpeed;
    this.maxSpeed;
    this.messageWin = "Congratulations, you won!";
    this.messageLose = "Sorry, you lost!";
    this.eventTimer = 0;
    this.eventInterval = 150;
    this.eventUpdate = false;
    this.touchStartX;
    this.swipeDistance = 50;
    this.restartButton = document.getElementById("restartButton");

    this.restartButton.addEventListener("click", () => {
      location.reload();
    });
    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    //controla con el mouse
    this.canvas.addEventListener("mousedown", (e) => {
      this.player.flap();
    });
    //controla con botones
    window.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") this.player.flap();
      if (e.key === "Shift" || e.key.toLowerCase() === "c")
        this.player.startCharge();
      if (e.key.toLowerCase() === "r") {
        location.reload();
      }
    });
    //controla con celular
    this.canvas.addEventListener("touchstart", (e) => {
      this.player.flap();
      this.touchStartX = e.changedTouches[0].pageX;
      console.log(this.touchStartX);
    });
    
    this.canvas.addEventListener("touchmove", (e) => {
      console.log(e.changedTouches[0].pageX - this.touchStartX);
      if (e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance) {
        this.player.startCharge();
      }
    });
  }

  resize(width, heigth) {
    this.canvas.width = width;
    this.canvas.height = heigth;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight;
    this.gravity = 0.15 * this.ratio;
    this.speed = 5 * this.ratio;
    this.minSpeed = this.speed;
    this.maxSpeed = this.speed * 5;
    this.background.resize();
    this.player.resize();
    this.createObstacles();
    this.obstacles.forEach((obstacle) => {
      obstacle.resize();
    });
    this.score = 0;
    this.timer = 0;
    this.gameOver = false;
    this.ctx.fillStyle = "blue";
    this.ctx.font = "40px 'Madimi One'";
    this.ctx.textAlign = "right";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 3;
  }

  render(timeElapsed) {
    this.background.draw();
    this.handlePeriodicEvents(timeElapsed);
    this.background.update();
    this.player.update();
    this.player.draw();
    this.ctx.save();
    this.ctx.fillStyle = "black";
    this.obstacles.forEach((obstacle) => {
      obstacle.draw();
      obstacle.update();
    });
    this.ctx.restore();
    this.timer += timeElapsed;
    this.drawScore();
  }
  createObstacles() {
    this.obstacles = [];
    const firstX = this.baseHeight * this.ratio;
    const obstaclesSpacing = 600 * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstaclesSpacing));
    }
  }
  formatTimer() {
    return (this.timer * 0.001).toFixed(1);
  }

  handlePeriodicEvents(timeElapsed) {
    if (this.eventTimer > this.eventInterval) {
      this.eventTimer = this.eventTimer % this.eventInterval;
      this.eventUpdate = true;
    } else {
      this.eventTimer += timeElapsed;
      this.eventUpdate = false;
    }
  }

  checkColitions(a, b) {
    const dx = a.colitionX - b.colitionX - 25 * this.ratio;
    const dy = a.colitionY - b.colitionY - 20 * this.ratio;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= a.colitionRadius + b.colitionRadius;
  }

  drawScore() {
    this.ctx.save();
    this.ctx.fillStyle = "white";
    //fillText(string, x, y) sirve para dibujar un texto en una posición
    this.ctx.fillText("Score: " + this.score, this.width - 15, 50);
    this.ctx.textAlign = "left";
    this.ctx.fillText("Timer: " + this.formatTimer(this.timer), 10, 50);
    if (this.gameOver) {
      this.ctx.textAlign = "center";
      this.ctx.font = "40px 'Madimi One', sans-serif";
      this.obstacles.length === 0
        ? (this.ctx.fillStyle = "green")
        : (this.ctx.fillStyle = "red");
      this.obstacles.length === 0
        ? this.ctx.fillText(
            this.messageWin,
            this.width / 2,
            this.height / 2 - 100
          )
        : this.ctx.fillText(
            this.messageLose,
            this.width / 2,
            this.height / 2 - 100
          );
      this.ctx.fillText(
        "Press 'R' to restart",
        this.width / 2,
        this.height / 2
      );
    }
    if (this.player.energy <= 20) this.ctx.fillStyle = "red";
    else if (this.player.energy < this.player.maxEnergy)
      this.ctx.fillStyle = "orange";
    else this.ctx.fillStyle = "green";
    for (let i = 0; i < this.player.energy; i++) {
      this.ctx.fillRect(10, this.height - 10 - i * this.player.barsize, 20, 15);
    }
    this.ctx.restore();
  }
}

window.addEventListener("load", async () => {
  async function createObstacles() {
    const numberOfObstacles = prompt("How many obstacles do you want?");
    return numberOfObstacles;
  }
  let numberOfObstacles = await createObstacles();
  let canvas = document.getElementById("canvas1");
  let ctx = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 720;
  const game = new Game(canvas, ctx,numberOfObstacles);
  let lastTime = 0;
  function animate(timeStamp) {
    let timeElapsed = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(timeElapsed);
    if (!game.gameOver) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
