class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
  
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('particle', './assets/particle.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {

        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.starfield.tilePositionX = 0;
        this.starfield.tilePositionY = 0;
        this.starfield.scrollFactorX = 0.5;
        this.starfield.scrollFactorY = 0.5;
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);


        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);


        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);


        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.pointer = this.input.activePointer;
        this.p1Rocket.x = Phaser.Math.Clamp(this.pointer.x, 0, game.config.width);

        this.input.on('pointerdown', () => {
            if (!this.gameOver) {
                this.p1Rocket.fire();
            }
        });
        


        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });
// new background music
        this.sound.play('background_music');

        // initialize score
        this.p1Score = 0;

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
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);


// display and hold highscore
    this.highScore = 0;
    let highScoreConfig = {
        fontFamily: 'Courier',
        fontSize: '12px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
            right: 5
        },
        fixedWidth: 110
    }
    this.highScore = parseInt(localStorage.getItem("highscore")) || 0;
    this.highScoreText = this.add.text(game.config.width - borderUISize - borderPadding - 100, borderUISize + borderPadding*2, 'High Score: ' + this.highScore, highScoreConfig);

    // make the rockets go faster
    this.time.addEvent({
        delay: 30000,
        callback: () => {
            this.ship01.moveSpeed += 1;
            this.ship02.moveSpeed += 1;
            this.ship03.moveSpeed += 1;
            this.p1Rocket.moveSpeed += 1;
        },
        loop: false
    });
    this.fireText = this.add.text(game.config.width / 2, game.config.height /6, 'FIRE', {
        fontFamily: 'Courier',
        fontSize: '32px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'center',
        padding: {
            top: 5,
            bottom: 5,
        },
    });
    this.fireText.setOrigin(0.5);
    this.fireText.setVisible(false);

  let clockConfig = {
    fontFamily: 'Courier',
    fontSize: '12px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'right',
    padding: {
        top: 5,
        bottom: 5,
        right: 5
    },
    fixedWidth: 110
}
this.clockText = this.add.text(game.config.width - borderUISize - borderPadding - 100, borderUISize + borderPadding *5, '', clockConfig);

// for particle explosion
this.particles = this.add.particles('particle');
this.emitter = this.particles.createEmitter({
    speed: 200,
    lifespan: 500,
    blendMode: 'Add',
    scale: {
        start: 1,
        end: 0,
    },
    on: false,
});

 
// for mouse control
  this.input.on('pointermove', function (pointer) {
    this.p1Rocket.x = pointer.x;
  }, this);

  this.input.on('pointerdown', function (pointer) {
    if (!this.gameOver) {
      this.p1Rocket.fire(this);
    }
  }, this);
  
}

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }


        this.starfield.tilePositionX -= 4;  

        if(!this.gameOver) {
            this.p1Rocket.update();           
             this.ship01.update();              
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.clock.delay += 3000;
            this.shipExplode(this.ship03);
            this.particles.emitParticleAt(this.ship03.x, this.ship03.y, 200);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.clock.delay += 3000;
            this.shipExplode(this.ship02);
            this.particles.emitParticleAt(this.ship02.x, this.ship02.y, 200);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.clock.delay += 3000;
            this.shipExplode(this.ship01);
            this.particles.emitParticleAt(this.ship01.x, this.ship01.y, this.particleConfig);
        }
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.p1Rocket.isFiring) {
            this.p1Rocket.isFiring = true;
            this.p1Rocket.fire();
            this.fireText.setVisible(true);
        }
        if (this.p1Rocket.isFiring) {
            this.fireText.setVisible(true);
        } else {
            this.fireText.setVisible(false);
        }

        // update clock text
        if (!this.gameOver) {
            // Calculate remaining seconds
            const elapsedMilliseconds = this.clock.delay - this.clock.getElapsed();
            const remainingSeconds = Math.max(Math.ceil(elapsedMilliseconds / 1000), 0);
        
            this.clockText.setText(`Time: ${remainingSeconds}`);
        }

        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
          
            // create particle explosion
            this.particles.emitParticleAt(this.ship03.x, this.ship03.y, 200);
          }
          
    }


    checkCollision(rocket, ship) {
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
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        if (this.p1Score > this.highScore) {
            this.highScore = this.p1Score;
            this.highScoreText.text = 'High Score: ' + this.highScore;
            localStorage.setItem("highscore", this.highScore); 
        }
        this.sound.play('sfx_explosion');
      }

 
}


// mods considering: tracking high score (5), implement 'FIRE' UI text (5), display time remaining on screen (5), 
//create new scrolling sprite for the background (5), add different copyright-free music to Play scene (5), 
//create 4 new explosion sounds effects (10), display the time remaining on the screen (10), 
//create new title screen (10), Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15),
// 