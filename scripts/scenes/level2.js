var player;
var enemy;
var flagSecond;
var score = 0;
var scoreText;
var playerTime = 0;
var minutes = 0;
var seconds = 0;
var playerTimeText;
var gameBGM;
var cursors;
var playerHP = 3;
var playerTextHP;
var xEnemyPosSecond = [119,943,303,275,330,754];
var yEnemyPosSecond = [150,-16,150,150,150,150];
var coin;
var coinPosXSecond = [116,300,911,962,762];
var coinPosYSecond = [101,150,150,150,150];
var hitEnemy;
var playerIsHit;
var coinCollideSFX;
var worldLayerSecond;
var goalSecond;
var coinsCollected = 0;
var coinsCollectedText;
class level2 extends Phaser.Scene{
    constructor(){
        super('level2');
        
    }

    preload (){
        this.load.image('bg', 'assets/background/Flat Night 2 BG.png');
        this.load.image('slimehost', 'assets/enemy/slimehost.png');

        this.load.image('platform', 'assets/misc/platform.png')
        this.load.image('flag', 'assets/misc/pearl.png');
        this.load.image('coins', 'assets/misc/coin.png');
        this.load.spritesheet('slime', 'assets/spritesheet/slime1.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('hits', 'assets/sounds/hitHurt.wav');
        this.load.audio('levelBGM', 'assets/sounds/gamemusic.wav');
        this.load.audio('hit', 'assets/sounds/hitHurt.wav');
        this.load.audio('coinSFX', 'assets/sounds/pickupCoin.wav');
        this.load.image('tiled', 'assets/spritesheet/mainlev_build.png');
        this.load.tilemapTiledJSON('map2', 'assets/maps/map2.json');
    }
    create(){
    //BACKGROUND
    let bg = this.add.image(400, 300, 'bg');
    bg.setScrollFactor(0);

    //MAP
    const map = this.make.tilemap({key : 'map2'});
    const tileSet = map.addTilesetImage('fantasymain', 'tiles');
    worldLayerSecond =  map.createLayer('groundLayer', tileSet);
    worldLayerSecond.setCollisionByExclusion([-1]);
    flag = map.createLayer('flag', tileSet);
    flag.setCollisionByExclusion([-1]);
   
    //SOUND
    hitEnemy = this.sound.add('hits');
    playerIsHit = this.sound.add('hit');
    gameBGM  = this.sound.add('levelBGM');
    gameBGM.play({
        loop: true
    });
    playerIsHit = this.sound.add('hit');
    coinCollideSFX = this.sound.add('coinSFX');
    //GOAL
    goalSecond = this.physics.add.group({
        key: 'flag',
        repeat: 0,
        setXY:  {x:1071,y:237, stepX: 0}
    });
  
    //PLAYER
    player = this.physics.add.sprite(0, 237, 'slime');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setGravity(0,0);
    player.setScale(0.5);
    this.physics.world.setBoundsCollision(true, false, false, false);

    //CAMERA
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setBounds(0,0, this.widthInPixels, this.heightInPixels);
    //COIN
    coin = this.physics.add.group({
        key: 'coins',
        repeat: 4,
        setXY:  {x: 0,
                 y: 0,
                 stepX: 40 }
    })
    coin.children.iterate(function (child, index){
        child.x = coinPosXSecond[index];
        child.y = coinPosYSecond[index];
        child.setScale(1);
        child.setGravity(0);
    });
    //ENEMY
    enemy = this.physics.add.group({
        key: 'slimehost',
        repeat: 5,
        setXY: { x: 0, 
                 y: 0, 
                 stepX: 40 }
    });
    enemy.children.iterate(function (child, index) {
        child.x = xEnemyPosSecond[index];
        child.y = yEnemyPosSecond[index];
        child.setScale(.9);
        child.flipX = true;
        child.body.immovable = true;
    });

    //SCORE TEXT & GAME TIME
    scoreText = this.add.text(250,190, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    coinsCollectedText = this.add.text(250, 200, 'Coins Collected: 0', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    playerTimeText = this.add.text(250, 220, 'Time: 0:00', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    playerTextHP = this.add.text(250, 210, 'Health Left : 3', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    scoreText.setScrollFactor(0);
    playerTimeText.setScrollFactor(0);
    playerTextHP.setScrollFactor(0);
    coinsCollectedText.setScrollFactor(0);

    //KEYS
    cursors = this.input.keyboard.createCursorKeys();
    //COLLIDER
    this.physics.add.collider(player, worldLayerSecond);
    this.physics.add.collider(enemy, worldLayerSecond);
    this.physics.add.collider(goalSecond, worldLayerSecond);
    this.physics.add.collider(coin, worldLayerSecond);
    this.physics.add.collider(player,enemy,collideEnemies,null, this);
    this.physics.add.overlap(player,goalSecond,this.collectFlag,null,this);
    this.physics.add.overlap(player,coin,getCoin,null,this);
    }
    update(){
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
            player.flipX = true;
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
            player.flipX = false;
        }
        else
        {
            player.setVelocityX(0);
        }
    
        if (cursors.up.isDown && player.body.onFloor())
        {
            player.setVelocityY(-200);
            
        }
        //TIMER
        timer();
       
        //Check if player on Void
        playerOnVoid(this);
    }
    collectFlag(player, goal) {
        
        this.physics.pause();
        player.disableBody(true,true);
        goal.destroy();
        this.scene.start('level3',score = 0 , playerTime = 0,coinsCollected = 0,gameBGM.stop(),playerHP = 3);
      }
}