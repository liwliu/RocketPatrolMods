// game configuration
let config = {
    type: Phaser.AUTO, 
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// set up UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4;

//let highScore = 0;
let p1Score;

// reserve some keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT;
