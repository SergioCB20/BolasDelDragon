class Obstacle {
    constructor(game, x) {
        this.game = game;
        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaledHeight);
        this.colitionX;
        this.colitionY;
        this.colitionRadius = this.scaledWidth * 0.5;
        this.speedY = Math.random() > 0.5? 4 * this.game.ratio : -4 * this.game.ratio;
        this.markedForDeletion = false;
    }
    update(){
        this.x -= this.game.speed;
        this.y += this.speedY;
        this.colitionX = this.x + this.colitionRadius;
        this.colitionY = this.y + this.colitionRadius;
        if(this.y < 0 || this.y >= this.game.height - this.scaledHeight){
            this.speedY *= -1;
        }
        if(this.isOffscreen()){
            this.markedForDeletion = true;
            this.game.obstacles = this.game.obstacles.filter(obstacle => {
                return !obstacle.markedForDeletion;
            })
            this.game.score++;
            console.log(this.game.obstacles.length);
            if(this.game.obstacles.length === 0) this.game.gameOver = true;
        }
        if(this.game.checkColitions(this, this.game.player)){
            this.game.gameOver = true;
            this.game.player.collided = true;
        }
    }
    draw() {
        this.game.ctx.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);
        this.game.ctx.beginPath();
        //arc(x, y, radius, startAngle, endAngle, anticlockwise)
        this.game.ctx.arc(this.colitionX, this.colitionY, this.colitionRadius, 0, 2 * Math.PI);
        //draw the circle
        this.game.ctx.stroke();
    }
    resize(){
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
    }
    isOffscreen() {
        return this.x < -this.scaledWidth;
    }
}