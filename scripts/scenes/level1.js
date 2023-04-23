var player;
var enemy;
var flag;
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
var xEnemyPos = [172,314,263,535,609,871];
var yEnemyPos = [238,274,203,165,257,255];
var coin;
var coinPosX = [180,273,444,775,951];
var coinPosY = [147,274,237,292,309];
var splatEnemy;
var playerIsHit;
var coinCollideSFX;
var worldLayer;
var goal;
var coinsCollected = 0;
var coinsCollectedText;
var currentStage = 0; 
class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
        
    }

    preload (){
        this.load.image('bg', 'assets/background/background3.png');
        this.load.image('slimehost', 'assets/enemy/slimehost.png');
        this.load.image('platform', 'assets/misc/platform.png')
        this.load.image('flag', 'assets/misc/pearl.png');
        this.load.image('coins', 'assets/misc/coin.png');
        this.load.spritesheet('slime', 'assets/spritesheet/slime1.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('hurt', 'assets/sounds/hitHurt.wav');
        this.load.audio('levelBGM', 'assets/sounds/gamemusic.wav');
        this.load.audio('hit', 'assets/sounds/hitHurt.wav');
        this.load.audio('coinSFX', 'assets/sounds/pickupCoin.wav');
        this.load.image('tiles', 'assets/spritesheet/mainlev_build.png');
        this.load.tilemapTiledJSON('map1', 'assets/maps/map1.json');
    }
    create(){
    //BACKGROUND
    let bg = this.add.image(400, 300, 'bg');
    bg.setScrollFactor(0);
    //MAP
  const map = this.make.tilemap({key : 'map1'});
    const tileSet = map.addTilesetImage('fantasymain', 'tiles');
    worldLayer =  map.createLayer('worldLayer', tileSet);
    worldLayer.setCollisionByExclusion([-1]);
    flag = map.createLayer('flag', tileSet);
    flag.setCollisionByExclusion([-1]);
     /* const map = this.make.tilemap({key:"map1"});
    const tileset = map.addTilesetImage("fantasymain","tiles");
    const layer = map.createLayer("worldLayer",tileset, 0, 0);
    const flagLayer = map.createLayer("flag",tileset, 0, 0);*/
   
 
    splatEnemy = this.sound.add('hurt');
    playerIsHit = this.sound.add('hit');

    gameBGM  = this.sound.add('levelBGM');
    gameBGM.play({
        loop: true
    });
    playerIsHit = this.sound.add('hit');
    coinCollideSFX = this.sound.add('coinSFX');
   
    goal = this.physics.add.group({
        key: 'flag',
        repeat: 0,
        setXY:  {x:887,y:167, stepX: 0}
    });
  
    
    player = this.physics.add.sprite(0, 237, 'slime');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setGravity(0,0);
    player.setScale(0.5);
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
        child.x = coinPosX[index];
        child.y = coinPosY[index];
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
        child.x = xEnemyPos[index];
        child.y = yEnemyPos[index];
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

    //KEYS
    
    //COLLIDER*/
    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(enemy, worldLayer);
    this.physics.add.collider(goal, worldLayer);
    this.physics.add.collider(coin, worldLayer);
    this.physics.add.collider(player,enemy,collideEnemies,null, this);
    this.physics.add.overlap(player,goal,this.collectFlag,null,this);
    this.physics.add.overlap(player,coin,getCoin,null,this);
    cursors = this.input.keyboard.createCursorKeys();
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
        this.scene.start('level2',score = 0 , playerTime = 0,coinsCollected = 0, gameBGM.stop(),playerHP = 3);
      }
}