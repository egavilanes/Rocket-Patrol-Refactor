// EMILY GAVILANES
// Rocket Patrol Revived
// Mods implemented:
// track high score (5)
// implement FIRE UI (5)
// allow player to move rocket after it's been fired (5)
// add copyright free music (5)
// implement speed increase (5)
// display time remaining (10)
// create new title screen (10)
// implement parallax scrolling (10)
// implement new scoring mechanism to add time to clock after successful hits (15)
// create particle explosion when rocket hits spaceship (15)
// implement mouse control when moving and firing (15)




let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);


let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;


let keyF, keyR, keyLEFT, keyRIGHT;