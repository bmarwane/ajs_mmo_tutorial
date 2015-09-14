'use stric';

var CharacterObj = require('client/gameObjects/CharacterObj');

function Play(){}

Play.prototype = {
    create: function(){
        this.game.stage.backgroundColor = 0xFFFFFF;
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.initMap();
        this.addTestPlayer();
        this.setupKeys();
    },
    initMap: function(){
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.map.addTilesetImage('collision', 'walkables');

        this.layer = this.map.createLayer('ground');

        this.map.createLayer('obstacles');
        this.map.createLayer('obstacles2');

        this.map.setCollision(2018, true, "collision");
        this.game.physics.p2.convertTilemap(this.map, "collision");
        this.layer.resizeWorld();
    },
    addTestPlayer: function(){
        this.game.world.setBounds(0, 0, 1600, 1600);
        this.player = new CharacterObj(this.game, 200, 200);
        this.game.camera.follow(this.player.sprite);
    },

    setupKeys: function(){
        this.keys = {};
        this.keys.up = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.keys.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.keys.left = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.keys.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    },

    update: function(){
        this.handlePlayerInputs();
        this.player.update();
    },

    handlePlayerInputs: function(){
        this.player.stopIfNoInput();
        if(this.keys.up.isDown){
            this.player.moveUp();
        }
        if(this.keys.down.isDown){
            this.player.moveDown();;
        }
        if(this.keys.left.isDown){
            this.player.moveLeft();
        }
        if(this.keys.right.isDown){
            this.player.moveRight();
        }
    }
};

module.exports = Play;