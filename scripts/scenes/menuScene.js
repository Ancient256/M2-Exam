class menuScene extends Phaser.Scene{
    constructor(){
        super('menuScene');
    }

    preload(){
        
        this.load.image('play','assets/misc/play2.png');
        this.load.image('creditsButton','assets/misc/credits.png');
        this.load.image('menuBackground', 'assets/misc/background1.png');
        this.load.image('exitMain', 'assets/misc/Exitbtn.png');
      

    }

    create(){
        //BACKGROUND
        this.add.image(400, 300, 'menuBackground').setScale(1.5);
        
        //BUTTONS
        const playButton = this.add.image(400,250,'play').setScale(0.7);
        playButton.setInteractive();
        playButton.on('pointerdown', () => {this.scene.start('level1');
        score = 0;
        playerTime = 0;
        coinsCollected = 0;
        });
        
        const creditButton = this.add.image(400,350,'creditsButton').setScale(0.35);
        creditButton.setInteractive();
        creditButton.on('pointerdown', () => {this.scene.start('credits')});
        
        const exitGame = this.add.image(400,450,'exitMain').setScale(1.5);
        exitGame.setInteractive();
        exitGame.on('pointerdown', () => {alert('Game Exited')});

       
    }

    update(){
    }
}