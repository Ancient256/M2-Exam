class creditScene extends Phaser.Scene{
    constructor(){
        super("credits");
        
    }
    preload(){
   
        this.load.image('return','assets/misc/return.png');
        this.load.image('crd','assets/misc/background1.png');
        
    }
    create(){
        //BACKGROUND
        this.add.image(400, 300, 'crd');
        //BUTTONS
        const returnButton = this.add.image(100,100,'return').setScale(.50);

        let creditText = this.add.text(100,300, 'Janmark Laurence D. Perucho',{font: '45px Arial', fill: "White"});
        creditText.setInteractive({userHandCursor: true});
       
      
        let sectionText = this.add.text(300,400, 'EMC - A223',{font: '45px Arial', fill: "White"});
        sectionText.setInteractive({userHandCursor: true});
    
        returnButton.setInteractive();
        returnButton.on('pointerdown', () => {this.scene.start('menuScene')});
        
    }
    update(){

    }
}