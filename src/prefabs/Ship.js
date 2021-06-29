class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        this.x -= this.moveSpeed;
       // console.log(this.x);
        if (this.moveSpeed > 0) {
            if(this.x <= 0 - this.width) {
                this.reset();
            }
        } else if (this.moveSpeed < 0) {
            if(this.x >= game.config.width + this.width) {
                this.reset();
            }
        }  
        
    }

    reset() {
        if (this.moveSpeed > 0) {
            this.x = game.config.width - 20;
        } else if (this.moveSpeed < 0){
            this.x = 20;
        }

    }

    changeDirection() {
        this.moveSpeed = -this.moveSpeed;
    }
}
