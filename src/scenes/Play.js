class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/Joker sprite.png');
        this.load.image('spaceship', './assets/joker_mask.png');
        this.load.image('mini', './assets/miniship.png');
        this.load.image('starfield', './assets/galaxy.png');
        this.load.audio('playSound', './assets/playTheme.mp3');
        this.load.audio('gameover', './assets/GameOver.mp3');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        let music = this.sound.add('playSound');
          music.volume = 0.05;
          music.loop = true;
          music.play();
 

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        if (game.settings.twoPlayer == true) {
            this.p2Rocket = new Rocket2(this, game.config.width/2 + 50, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5);
        }


        // add spaceships (x3)
        this.ship01 = new Ship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Ship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Ship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.miniShip = new Ship(this, game.config.width +borderUISize * 4, borderPadding*10, 'mini', 0, 60).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        p1Score = 0;

          // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, p1Score, scoreConfig);

        scoreConfig.fixedWidth = 0;
        this.hiScoreText = this.add.text(borderUISize + borderPadding +380, borderUISize + borderPadding*2, 'HI-SCORE:'+ highScore, scoreConfig);

        this.fireText = this.add.text(borderUISize + borderPadding + 300, borderUISize + borderPadding*2, 'FIRE', scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        this.miniShip.moveSpeed = 6;
        
        this.timer = this.time.delayedCall(30000, () => {
            this.ship01.moveSpeed *= 2;
            this.ship02.moveSpeed *= 2;
            this.ship03.moveSpeed *= 2;
        })

        // 60-second play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.sound.play('gameover');
            this.gameOver = true;
            if (p1Score > highScore) {
                highScore = p1Score;
            }
        }, null, this);

        //this.timeText = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.time, scoreConfig);

    }

    update() {
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {               
            this.p1Rocket.update();
            if (game.settings.twoPlayer == true){
                this.p2Rocket.update(); 
            }    // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.miniShip.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.miniShip)){
            this.p1Rocket.reset();
            this.shipExplode(this.miniShip);
        }
        if (game.settings.twoPlayer == true) {
            if(this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship03);   
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship02);
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship01);
            }
            if (this.checkCollision(this.p2Rocket, this.miniShip)){
                this.p2Rocket.reset();
                this.shipExplode(this.miniShip);
            }
        }
        
          // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        if (p1Score > highScore) {
            highScore = p1Score;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.changeDirection();
            ship.alpha = 1;
            boom.destroy();
        });

    

        // score add and repaint
        p1Score += ship.points;
        this.scoreLeft.text = p1Score; 
        if (ship = this.ship01){
            this.sound.play('Explosion');
        }
        if (ship = this.ship02){
            this.sound.play('Explosion2');
        }
        if (ship = this.ship03){
            this.sound.play('Explosion3');
        }
        if (ship = this.miniShip){
            this.sound.play('Explosion4');
        }
        

    }

}