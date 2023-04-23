class gameOverScene extends Phaser.Scene{
    constructor(){
        super("endScene");

    }
    preload(){
     
        this.load.image('reset','assets/misc/reset.png');
        this.load.image('return','assets/misc/Exitbtn.png');
        this.load.image('gameOverBg', 'assets/background/background4b.png');
        
    }
    create() {

        //SCOREBOARD
        const playerScore = score;
        const playerMinutes = minutes;
        const playerSeconds = seconds.toString().padStart(2, '0');
        const playerCoinScore = coinsCollected;
        this.add.image(400, 300, 'gameOverBg').setScale(1.5);
        const gameOverText = this.add.text(400, 300, 'Game Over!\nScore: '+ playerScore + '\nTime Survived: '+ playerMinutes +':'+ playerSeconds +'\nCoins Collected: ' + playerCoinScore, {
            fontFamily: 'Arial',
            fontSize: '32px',
            fill: '#fff'
        });
        gameOverText.setOrigin(0.5);
        
        //BTN
        const resetButton = this.add.image(300,500,'reset').setScale(.05);
        resetButton.setInteractive();
        resetButton.on('pointerdown', () => {this.scene.start('level1');
        score = 0;
        playerTime = 0;
        coinsCollected = 0;
        });
        const returnMainMenu = this.add.image(500,500,'return').setScale(1.3);
        returnMainMenu.setInteractive();
        returnMainMenu.on('pointerdown', () => {this.scene.start('menuScene')});
    }
    update(){
        
    }
}
