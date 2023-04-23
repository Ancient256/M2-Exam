var player;
var enemy;
var flagThird;
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
var xEnemyPosThird = [244,407,331,535,680,944];
var yEnemyPosThird = [219,219,165,165,273,255];
var coin;
var coinPosXThird = [411,133,539,775,805];
var coinPosYThird = [219,219,200,292,273];
var hitEnemy;
var playerIsHit;
var coinCollideSFX;
var worldLayerThird;
var goalThird;
var coinsCollected = 0;
var coinsCollectedText;
class level3 extends Phaser.Scene{
    constructor(){
        super('level3');
        
    }

    preload (){
        this.load.image('bg', 'assets/background/background4a.png');
        this.load.image('slimehost', 'assets/enemy/slimehost.png');
        this.load.image('platform', 'assets/misc/platform.png')
        this.load.image('flag', 'assets/misc/pearl.png');
        this.load.image('coins', 'assets/misc/coin.png');
        this.load.spritesheet('slime', 'assets/spritesheet/slime1.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('hits', 'assets/sounds/hitHurt.wav');
        this.load.audio('levelBGM', 'assets/sounds/gamemusic.wav');
        this.load.audio('hit', 'assets/sounds/hitHurt.wav');
        this.load.audio('coinSFX', 'assets/sounds/pickupCoin.wav');
        this.load.image('tiles', 'assets/spritesheet/mainlev_build.png');
        this.load.tilemapTiledJSON('map3', 'assets/maps/map3.json');
    }
    create(){
    
    let bg = this.add.image(400, 300, 'bg');
    bg.setScrollFactor(0);

    
    const map = this.make.tilemap({key : 'map3'});
    const tileSet = map.addTilesetImage('fantasymain', 'tiles');
    worldLayerThird =  map.createLayer('groundLayerThird', tileSet);
    worldLayerThird.setCollisionByExclusion([-1]);
    flagThird = map.createLayer('flagThird', tileSet);
    flagThird.setCollisionByExclusion([-1]);
   

    hitEnemy = this.sound.add('hits');
    playerIsHit = this.sound.add('hit');
    gameBGM  = this.sound.add('levelBGM');
    gameBGM.play({
        loop: true
    });
    playerIsHit = this.sound.add('hit');
    coinCollideSFX = this.sound.add('coinSFX');
   
    goalThird = this.physics.add.group({
        key: 'flag',
        repeat: 0,
        setXY:  {x:1067,y:235, stepX: 0}
    });
  
   
    player = this.physics.add.sprite(0, 237, 'slime');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setGravity(0,0);
    player.setScale(0.8);
    this.physics.world.setBoundsCollision(true, false, false, false);

   
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(2.5);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setBounds(0,0, this.widthInPixels, this.heightInPixels);
   
    coin = this.physics.add.group({
        key: 'coins',
        repeat: 4,
        setXY:  {x: 0,
                 y: 0,
                 stepX: 40 }
    })
    coin.children.iterate(function (child, index){
        child.x = coinPosXThird[index];
        child.y = coinPosYThird[index];
        child.setScale(1);
        child.setGravity(0);
    });

    enemy = this.physics.add.group({
        key: 'slimehost',
        repeat: 5,
        setXY: { x: 0, 
                 y: 0, 
                 stepX: 40 }
    });
    enemy.children.iterate(function (child, index) {
        child.x = xEnemyPosThird[index];
        child.y = yEnemyPosThird[index];
        child.setScale(.9);
        child.flipX = true;
        child.body.immovable = true;
    });

   
    scoreText = this.add.text(250,190, 'Score: 0', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    coinsCollectedText = this.add.text(250, 200, 'Coins Collected: 0', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    playerTimeText = this.add.text(250, 220, 'Time: 0:00', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    playerTextHP = this.add.text(250, 210, 'Health Left : 3', { fontSize: '32px', fill: '#fff' }).setScale(.3);
    scoreText.setScrollFactor(0);
    playerTimeText.setScrollFactor(0);
    playerTextHP.setScrollFactor(0);
    coinsCollectedText.setScrollFactor(0);

 
    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, worldLayerThird);
    this.physics.add.collider(enemy, worldLayerThird);
    this.physics.add.collider(goalThird, worldLayerThird);
    this.physics.add.collider(coin, worldLayerThird);
    this.physics.add.collider(player,enemy,collideEnemies,null, this);
    this.physics.add.overlap(player,goalThird,this.collectFlag,null,this);
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
     
        timer();
    
        
        playerOnVoid(this);
    }
    collectFlag(player, goal) {
        this.physics.pause();
        player.disableBody(true,true);
        goal.destroy();
        this.scene.start('winScene',score,minutes,seconds,coinsCollected,gameBGM.stop(),playerHP = 3);
      }
}